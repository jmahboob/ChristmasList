# ChristmasList
A small Flask + AngularJS based Christmas list application for my family to use this holiday season.

**In case anyone is wondering I'm using the Issues tab as a sort of "ToDo" list for the project.  I don't have some sort of split personality disorder where I'm commenting on my own work without realizing it.**

# Current (05 Oct 2016) System Images

![](supporting/xmaslist_mylist.PNG)

![](supporting/xmaslist_sidenav.PNG)

# Dependencies (so far)

## Python

- Flask >= 0.11.1
- Flask-Login >= 0.3.2
- Flask-WTF >= 0.12
- Flask-bcrypt >= 0.7.1
- Flask-SQLAlchemy >= 2.1
- Flask-Security >= 1.7.5
- Flask-Principal >= 0.4.0
- Flask-Migrate >= 2.0.0
- SQLAlchemy >= 1.0.15
- Celery >= 3.1.24

### Celery/Redis Notes

The system is currently using the very Pythonic way of dealing with asynchronous calls.  Redis and a single Celery worker are running in the system and they combine to handle brokered calls to the sendEmail function.

While this seems a bit excessive, it reduces the burden of sending emails tremendously.  Originally emails were being sent to Administrators whenever new items were added to the database.  The synchronous addition of this increased the time for the call in the browser to ~1.35 SECONDS.  Backgrounding the task with the redis/celery combination brings this back down to ~<100ms.

## JavaScript/CSS

- Bootstrap CSS >= 3.2.0
- Angular Bootstrap >= ???
- jQuery >= 2.2.1
- AngularJS >= 1.5.8 < 2.0.0
- Angular-Animate >= 1.5.8 < 2.0.0
- Angular-Smart-Table >= ???
