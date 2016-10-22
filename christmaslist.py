#!/usr/bin/env python

import newrelic.agent
newrelic.agent.initialize('newrelic.ini')

#import os
#import sys
import datetime

#from sqlalchemy import Column, ForeignKey, Integer, String, Numeric, DateTime, Boolean
#from sqlalchemy.ext.declarative import declarative_base
#from sqlalchemy.orm import relationship, sessionmaker
#from sqlalchemy import create_engine

import base64 as b64

from flask import Flask, request, jsonify, render_template, redirect, url_for, json
#from flask_login import LoginManager, login_required, login_user, logout_user, current_user
from flask_security import Security, SQLAlchemyUserDatastore, login_required, RoleMixin, UserMixin, current_user, login_user, logout_user, roles_required
from flask_wtf import Form
from wtforms import StringField, BooleanField
from wtforms.validators import DataRequired
import flask_bcrypt as bcrypt
from flask_sqlalchemy import SQLAlchemy
#from flask_migrate import Migrate
from flask_mail import Mail, Message

from celery import Celery

"""
def make_celery(app):
    celery = Celery(app.import_name, backend=app.config['CELERY_RESULT_BACKEND'],
                    broker=app.config['CELERY_BROKER_URL'])
    celery.conf.update(app.config)
    TaskBase = celery.Task
     class ContextTask(TaskBase):
        abstract = True
         def __call__(self, *args, **kwargs):
            with app.app_context():
                return TaskBase.__call__(self, *args, **kwargs)
    celery.Task = ContextTask
    return celery
"""

app = Flask(__name__)
app.config.from_object('config')
#app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///christmaslist.db'
db = SQLAlchemy(app)
#migrate = Migrate(app, db)
#login_manager = LoginManager()
#login_manager.init_app(app)
mail = Mail(app)

#celery backend processing
celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])
celery.conf.update(app.config)

#DB_NAME = "christmaslist"
#Base = declarative_base()

#@login_manager.user_loader
#def user_loader(user_id):
#    return User.query.filter_by(email=user_id).first()

class LoginForm(Form):
    email = StringField('Email', validators=[DataRequired()])
    password = StringField('Password, validators=[DataRequired()]')
    remember = BooleanField('remember', default=False)

roles_users = db.Table('roles_users',
                       db.Column('user_id', db.Integer(), db.ForeignKey('user.id')),
                       db.Column('role_id', db.Integer(), db.ForeignKey('role.id')))

class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

class User(db.Model, UserMixin):
    #__tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    #authenticated = db.Column(db.Boolean, default=False)
    active = db.Column(db.Boolean(), default=False)
    current_login_at = db.Column(db.DateTime())
    last_login_at = db.Column(db.DateTime())
    current_login_ip = db.Column(db.String(45))
    last_login_ip = db.Column(db.String(45))
    login_count = db.Column(db.Integer())
    password = db.Column(db.String(255), nullable=False)
    roles = db.relationship('Role', secondary=roles_users,
                            backref=db.backref('users', lazy='dynamic'))

    def serialize(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email
        }

    #def is_active(self):
    #    return True

    #def get_id(self):
    #    return self.email

    #def is_authenticated(self):
    #    return self.authenticated

    #def is_anonymous(self):
    #    return False

user_datastore = SQLAlchemyUserDatastore(db, User, Role)
security = Security(app, user_datastore)


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
    deleted = db.Column(db.Integer)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'link': self.link,
            'cost': self.cost,
            'created': self.created,
            'requester_id': self.requester_id,
            'granter_id': self.granter_id
        }

class Purchase(db.Model):
    #__tablename__ = 'purcahse'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(500))
    link = db.Column(db.String(500))
    created = db.Column(db.DateTime)
    purchaser_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    purchaser = db.relationship('User', foreign_keys=[purchaser_id])

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'link': self.link,
            'created': self.created,
            'purchaser_id': self.purchaser_id
        }


class Idea(db.Model):
    #__tablename__ = 'purcahse'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(500))
    link = db.Column(db.String(500))
    created = db.Column(db.DateTime)
    forperson_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    forperson = db.relationship('User', foreign_keys=[forperson_id])
    byperson_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    byperson = db.relationship('User', foreign_keys=[byperson_id])

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'link': self.link,
            'created': self.created,
            'forperson_id': self.forperson_id,
            'byperson_id': self.byperson_id
        }


"""
def open_session():
    engine = create_engine('sqlite:///' + DB_NAME + '.db')
    Base.metadata.bind = engine
    DBSession = sessionmaker(bind=engine)
    session = DBSession()
    return session
"""

# Because error handlers are THE MOST IMPORTANT THING
#####################################################
### ERROR HANDLERS
#####################################################
@app.errorhandler(401)
def access_restricted(e):
    return render_template("401.html")

@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html")

#####################################################
### PRIMARY, DEFAULT, USER MANAGEMENT
#####################################################
@app.route("/")
@login_required
def root():
    return render_template('index.html')

@app.route("/admin")
@roles_required('admin')
def admin():
    return "Admin Permission Granted"

#@app.route("/login", methods=['GET', 'POST'])
#def login():
#    print (current_user)
#    user = current_user
#    if user.is_authenticated:
#        return redirect(url_for("root"))

#form = LoginForm()
#    if form.validate_on_submit():
#        #user = User.query.get(form.email.data)
#        print "User clicked login button"
#        user = User.query.filter_by(email=form.email.data).first()
#        print user
#        if user:
#            if bcrypt.check_password_hash(user.password, form.password.data):
#                user.authenticated = True
#                db.session.add(user)
#                db.session.commit()
#                login_user(user, remember=True)
#                return redirect(url_for("root"))
#            else:
#                return "Invalid Password"
#        else:
#            return "Invalid User"
#    return render_template("login.html", form=form)

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

@app.route("/get/currentuser")
@login_required
def getCurrentUser():
    user = current_user
    ret = {}
    ret['id'] = user.id
    ret['name'] = user.first_name + " " + user.last_name
    return jsonify(ret)

@app.route("/get/user/<id>")
@login_required
def getUserByID(id):
    if id == "all":
        users = User.query.all()
        ret = []
        for user in users:
            ret.append(user.serialize())
        return jsonify(ret)

    user = User.query.filter_by(id=id).first()
    if user:
        return jsonify(user.serialize())
    else:
        return "Invalid User ID"


@app.route("/create/user", methods=['POST'])
@login_required
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
@login_required
def create_wish():
    if request.method == 'GET':
        return render_template('addwish.html')
    elif request.method == 'POST':
        data = request.get_json(force=True)
        print data
        print current_user

        new_wish = Wish(
            name = data['name'],
            description = data['description'],
            cost = data['cost'],
            link = data['url'],
            created = datetime.datetime.now(),
            requester = current_user,
            granter = None,
            deleted = 0
        )
        db.session.add(new_wish)
        db.session.commit()

        sendEmail(current_user.first_name + " " + current_user.last_name, "Created New Wish")

        return jsonify(data)

@app.route("/delete/wish/<id>", methods=['DELETE'])
@login_required
def delete_wish(id):
    if request.method == 'DELETE':
        to_delete = Wish.query.filter_by(id=id).first()
        print current_user.id
        print to_delete.requester_id
        if current_user.id != to_delete.requester_id:
            return "You can't delete other users wishes...you monster."
        else:
            to_delete.deleted = 1
            db.session.commit()
            return jsonify(to_delete.serialize())
    return "Error in /delete/wish/<id>"

@app.route("/create/purchase", methods=['POST', 'GET'])
@login_required
def create_purchase():
    if request.method == 'GET':
        return render_template('addpurchase.html')
    else:
        pass

@app.route("/create/idea", methods=['POST', 'GET'])
@login_required
def create_idea():
    if request.method == 'GET':
        return render_template('addidea.html')
    else:
        data = request.get_json(force=True)
        print data
        print current_user

        new_idea = Idea(
            name = data['name'],
            description = data['description'],
            link = data['url'],
            created = datetime.datetime.now(),
            byperson_id = current_user.id,
            forperson_id = data['forperson']
        )
        print new_idea.serialize()
        db.session.add(new_idea)
        db.session.commit()

        sendEmail.delay(current_user.first_name + " " + current_user.last_name, "Created new idea")

        return jsonify(data)

@app.route("/test")
@login_required
def test():
    return "<center>Nope :-(</center>"
    #return render_template("test.html")

@app.route("/testEmail")
@login_required
@roles_required('admin')
def testEmail():
    msg = Message(
        'Test',
        sender='xmaslist2016@gmail.com',
        recipients = ['jamal.mahboob@gmail.com']
    )
    msg.body = "Test Flask-Email"
    mail.send(msg)
    return "Sent"

@celery.task
def sendEmail(title, body):
    with app.app_context():
        msg = Message(
            title,
            sender='xmaslist2016@gmail.com',
            recipients = ['xmaslist2016@gmail.com']
        )
        msg.body = body
        mail.send(msg)

@app.route("/list")
@login_required
def main_list():
    return render_template("list.html")

@app.route("/list/loadlist")
@login_required
def load_main_list():
    list = Wish.query.filter((Wish.requester_id != current_user.id) & (Wish.deleted != 1)).all()
    ret = []
    for wish in list:
        ret.append(wish.serialize())
    return jsonify(ret)

@app.route("/mylist")
@login_required
def myList():
    return render_template("mylist.html")

@app.route("/mylist/loadlist")
@login_required
def loadList():
    list = Wish.query.filter((Wish.requester_id == current_user.id) & (Wish.deleted != 1)).all()
    ret = []
    for wish in list:
        ret.append(wish.serialize())
    return jsonify(ret)

@app.route("/myideas")
@login_required
def myIdeas():
    return render_template("myideas.html")

@app.route("/myideas/loadideas")
@login_required
def loadIdeas():
    list = Idea.query.filter_by(byperson_id=current_user.id).all()
    ret = []
    for idea in list:
        ret.append(idea.serialize())
    return jsonify(ret)

@app.route("/mypurchases")
@login_required
def myPurchases():
    return render_template("mypurchases.html")

@app.route("/mypurchases/loadpurchases")
@login_required
def loadPurchases():
    list = Purchase.query.all()
    ret = []
    for purchase in list:
        ret.append(purchase.serialize())
    return jsonify(ret)

@app.route("/familyMembers/<function>")
@login_required
def familyMembers(function):
    if function == 'load':
        users = User.query.order_by(User.id).all()
        ret = []
        for user in users:
            print user.first_name
            if user.id != 0:
                ret.append(user.serialize())
        return jsonify(ret)
    elif function == 'page':
        return render_template("familyMembers.html")
    return "Error"

@app.route("/<first>/<last>/isgay")
def isGay(first, last):
    first = first[0].upper() + first[1:].lower()
    last = last[0].upper() + last[1:].lower()
    outstr = "%s %s \nis a ho...mo...sexual!" % (first, last)
    outstr = b64.b64encode(outstr)
    to_ret = "<html><head><style>img{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);}</style></head>"
    return to_ret + "<img src=https://frinkiac.com/gif/S08E15/419251/423205.gif?b64lines=" + outstr + " /></html>"


if __name__ == "__main__":
    #engine = create_engine('sqlite:///' + DB_NAME + '.db')
    #Base.metadata.create_all(engine)
    app.run(host="0.0.0.0", port=80, debug=True)
