#!/usr/bin/env python

#import os
#import sys
import datetime

from sqlalchemy import Column, ForeignKey, Integer, String, Numeric, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy import create_engine

from flask import Flask, request, jsonify, render_template, redirect, url_for
from flask_login import LoginManager, login_required, login_user, logout_user, current_user
from flask_wtf import Form
from wtforms import StringField, BooleanField
from wtforms.validators import DataRequired
import flask_bcrypt as bcrypt

app = Flask(__name__)
app.config.from_object('config')
login_manager = LoginManager()
login_manager.init_app(app)

DB_NAME = "christmaslist"
Base = declarative_base()

@login_manager.user_loader
def user_loader(user_id):
    return User.query.get(user_id)

class LoginForm(Form):
    email = StringField('Email', validators=[DataRequired()])
    remember = BooleanField('remember', default=False)

class User(Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(50), nullable=False)
    authenticated = Column(Boolean, default=False)

    def is_active(self):
        return True

    def get_id(self):
        return self.email

    def is_authenticated(self):
        return self.authenticated

    def is_anonymous(self):
        return False



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

@app.route("/admin")
@login_required
def admin():
    return "Admin Permission Granted"

@app.route("/login", methods=['GET', 'POST'])
def login():
    session = open_session()

    form = LoginForm()
    if form.validate_on_submit():
        user = session.query.get(form.email.data)
        if user:
            if bcrypt.check_password_hash(user.password, form.password.data):
                user.authenticated = True
                session.add(user)
                session.commit()
                session.close()
                login_user(user, remember=True)
                return redirect(url_for("/"))
    return render_template("login.html", form=form)

@app.route("/logout")
@login_required
def logout():
    session = open_session()
    user = current_user
    user.authenticated = False
    session.add(user)
    session.commit()
    session.close()
    logout_user()
    return "Logout"

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

@app.route("/create/wish", methods=['POST', 'GET'])
def create_wish():
    if request.method == 'GET':
        return render_template('addwish.html')
    elif request.method == 'POST':
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
