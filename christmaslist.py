#!/usr/bin/env python

#import os
#import sys
#import datetime

#from sqlalchemy import Column, ForeignKey, Integer, String, Numeric, DateTime, Boolean
#from sqlalchemy.ext.declarative import declarative_base
#from sqlalchemy.orm import relationship, sessionmaker
#from sqlalchemy import create_engine

from flask import Flask, request, jsonify, render_template, redirect, url_for
from flask_login import LoginManager, login_required, login_user, logout_user, current_user
from flask_wtf import Form
from wtforms import StringField, BooleanField
from wtforms.validators import DataRequired
import flask_bcrypt as bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message

app = Flask(__name__)
app.config.from_object('config')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///christmaslist.db'
db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
mail = Mail(app)

#DB_NAME = "christmaslist"
#Base = declarative_base()

@login_manager.user_loader
def user_loader(user_id):
    return User.query.filter_by(email=user_id).first()

class LoginForm(Form):
    email = StringField('Email', validators=[DataRequired()])
    password = StringField('Password, validators=[DataRequired()]')
    remember = BooleanField('remember', default=False)

class User(db.Model):
    #__tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    authenticated = db.Column(db.Boolean, default=False)
    password = db.Column(db.String(500), nullable=False)

    def is_active(self):
        return True

    def get_id(self):
        return self.email

    def is_authenticated(self):
        return self.authenticated

    def is_anonymous(self):
        return False



class Wish(db.Model):
    #__tablename__ = 'wish'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(500))
    link = db.Column(db.String(500))
    cost = db.Column(db.Numeric)
    created = db.Column(db.DateTime)
    requester_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    requester = db.relationship('User', foreign_keys=[requester_id])
    granter_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    granter = db.relationship('User', foreign_keys=[granter_id])

"""
def open_session():
    engine = create_engine('sqlite:///' + DB_NAME + '.db')
    Base.metadata.bind = engine
    DBSession = sessionmaker(bind=engine)
    session = DBSession()
    return session
"""

# Because error handlers are THE MOST IMPORTANT THING
@app.errorhandler(401)
def access_restricted(e):
    return render_template("401.html")

@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html")

@app.route("/")
@login_required
def root():
    return render_template('index.html')

@app.route("/admin")
@login_required
def admin():
    return "Admin Permission Granted"

@app.route("/login", methods=['GET', 'POST'])
def login():
    print (current_user)
    user = current_user
    if user.is_authenticated:
        return redirect(url_for("root"))

    form = LoginForm()
    if form.validate_on_submit():
        #user = User.query.get(form.email.data)
        user = User.query.filter_by(email=form.email.data).first()
        if user:
            if bcrypt.check_password_hash(user.password, form.password.data):
                user.authenticated = True
                db.session.add(user)
                db.session.commit()
                login_user(user, remember=True)
                return redirect(url_for("root"))
            else:
                return "Invalid Password"
        else:
            return "Invalid User"
    return render_template("login.html", form=form)

@app.route("/logout")
@login_required
def logout():
    #session = open_session()
    user = current_user
    user.authenticated = False
    db.session.add(user)
    db.session.commit()
    logout_user()
    return render_template("logout.html")

@app.route("/create/user", methods=['POST'])
def create_user():
    data = request.get_json(force=True)
    if data == None:
        return "Error processing request.  Posted information must be a JSON object to create a new user"

    #session = open_session()

    #new_user = User(
    #                first_name = data['first_name'],
    #                last_name = data['last_name'],
    #                email = data['email']
    #)
    #session.add(new_user)
    #session.commit()
    #session.close()
    return jsonify(data)

@app.route("/create/wish", methods=['POST', 'GET'])
def create_wish():
    if request.method == 'GET':
        return render_template('addwish.html')
    elif request.method == 'POST':
        data = request.get_json(force=True)

        #session = open_session()

        #user = session.query(User).first()

        #new_wish = Wish(
        #    name = data['name'],
        #    description = data['description'],
        #    link = data['link'],
        #    cost = data['cost'],
        #    created = datetime.datetime.now(),
        #    requester = user,
        #    granter = None
        #)
        #session.add(new_wish)
        #session.commit()
        #session.close()
        return jsonify(data)

@app.route("/test")
@login_required
def test():
    return "Nope :-("
    #return render_template("test.html")

@app.route("/testEmail")
@login_required
def testEmail():
    msg = Message(
        'Test',
        sender='xmaslist2016@gmail.com',
        recipients = ['jamal.mahboob@gmail.com']
    )
    msg.body = "Test Flask-Email"
    mail.send(msg)
    return "Sent"

@app.route("/myList")
@login_required
def myList():
    return "<center>This will be your list of requested items</center>"

@app.route("/familyMembers/<function>")
@login_required
def familyMembers(function):
    if function == 'load':
        #return "<center>" + str(User.query.order_by(User.first_name)) + "</center>"
        users = User.query.order_by(User.first_name).all()
        for user in users:
            print user.first_name
        #return "<center>This will show a list of all the system users</center>"
        return "printed to debug - check apache error log"
    elif function == 'page':
        return render_template("familyMembers.html")
    return "Error"


if __name__ == "__main__":
    #engine = create_engine('sqlite:///' + DB_NAME + '.db')
    #Base.metadata.create_all(engine)
    app.run(host="0.0.0.0", port=80, debug=True)
