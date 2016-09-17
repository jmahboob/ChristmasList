#!/usr/bin/env python

import os
import sys
import datetime

from sqlalchemy import Column, ForeignKey, Integer, String, Numeric, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy import create_engine

from flask import Flask, request, jsonify, render_template
app = Flask(__name__)

DB_NAME = "christmaslist"
Base = declarative_base()

class User(Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(50), nullable=False)

class Wish(Base):
    __tablename__ = 'wish'
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(String(500))
    link = Column(String(500))
    cost = Column(Numeric)
    created = Column(DateTime)
    requester_id = Column(Integer, ForeignKey('user.id'))
    requester = relationship(User, foreign_keys=[requester_id])
    granter_id = Column(Integer, ForeignKey('user.id'))
    granter = relationship(User, foreign_keys=[granter_id])

def open_session():
    engine = create_engine('sqlite:///' + DB_NAME + '.db')
    Base.metadata.bind = engine
    DBSession = sessionmaker(bind=engine)
    session = DBSession()
    return session

@app.route("/")
def root():
    return render_template('index.html')

@app.route("/create/user", methods=['POST'])
def create_user():
    data = request.get_json(force=True)
    if data == None:
        return "Error processing request.  Posted information must be a JSON object to create a new user"

    session = open_session()

    new_user = User(
                    first_name = data['first_name'],
                    last_name = data['last_name'],
                    email = data['email']
    )
    session.add(new_user)
    session.commit()
    session.close()
    return jsonify(data)

@app.route("/create/wish", methods=['POST'])
def create_wish():
    data = request.get_json(force=True)

    session = open_session()

    user = session.query(User).first()

    new_wish = Wish(
        name = data['name'],
        description = data['description'],
        link = data['link'],
        cost = data['cost'],
        created = datetime.datetime.now(),
        requester = user,
        granter = None
    )
    session.add(new_wish)
    session.commit()
    session.close()
    return jsonify(data)


if __name__ == "__main__":
    engine = create_engine('sqlite:///' + DB_NAME + '.db')
    Base.metadata.create_all(engine)
    app.run(host="0.0.0.0", port=80, debug=True)
