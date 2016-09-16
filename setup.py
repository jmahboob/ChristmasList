#!/usr/bin/env python

"""
Christmas List
--------------

A simple (ish) web application which aids with the coordinating of Christmas Lists (or any list) amongst a group of people.
"""

from distutils.core import setup

setup(name='Christmas List',
      version='1.0',
      description='Simple Christmas (or any other type) List Coordination Application',
      author='Jamal Mahboob',
      author_email='jamal.mahboob@gmail.com'
      )

about = {}

install_requires = [
    'Flask==0.11.1'
]
