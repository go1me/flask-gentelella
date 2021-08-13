from flask import Flask, url_for
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from apscheduler.schedulers.background import BackgroundScheduler
from flask_apscheduler import APScheduler
from importlib import import_module
from logging import basicConfig, DEBUG, getLogger, StreamHandler
from os import path
import queue

db = SQLAlchemy()
login_manager = LoginManager()
scheduler_return_value_queue = queue.Queue()


# 初始化调度器
scheduler = APScheduler(BackgroundScheduler(timezone="Asia/Shanghai"))


def record_return_value_scheduler(return_value):
    scheduler_return_value_queue.put(return_value)
def get_return_value_scheduler():
    scheduler_return_value_queue.get()

def register_extensions(app):
    db.init_app(app)
    login_manager.init_app(app)
    scheduler.init_app(app)
    scheduler.start()


def register_blueprints(app):
    for module_name in ('base', 'ctf', 'forms', 'ui', 'home', 'tables', 'data', 'additional', 'base'):
        module = import_module('app.{}.routes'.format(module_name))
        app.register_blueprint(module.blueprint)


def configure_database(app):

    @app.before_first_request
    def initialize_database():
        db.create_all()

    @app.teardown_request
    def shutdown_session(exception=None):
        db.session.remove()


def configure_logs(app):
    basicConfig(filename='error.log', level=DEBUG)
    logger = getLogger()
    logger.addHandler(StreamHandler())


def apply_themes(app):
    """
    Add support for themes.

    If DEFAULT_THEME is set then all calls to
      url_for('static', filename='')
      will modfify the url to include the theme name

    The theme parameter can be set directly in url_for as well:
      ex. url_for('static', filename='', theme='')

    If the file cannot be found in the /static/<theme>/ lcation then
      the url will not be modified and the file is expected to be
      in the default /static/ location
    """
    @app.context_processor
    def override_url_for():
        return dict(url_for=_generate_url_for_theme)

    def _generate_url_for_theme(endpoint, **values):
        if endpoint.endswith('static'):
            themename = values.get('theme', None) or \
                app.config.get('DEFAULT_THEME', None)
            if themename:
                theme_file = "{}/{}".format(themename, values.get('filename', ''))
                if path.isfile(path.join(app.static_folder, theme_file)):
                    values['filename'] = theme_file
        return url_for(endpoint, **values)


def create_app(config, selenium=False):
    app = Flask(__name__, static_folder='base/static')
    app.config.from_object(config)
    if selenium:
        app.config['LOGIN_DISABLED'] = True

    #定时调度器apscheduler配置
    app.config['SCHEDULER_API_ENABLED '] = False #  不适用api
    app.config['SCHEDULER_TIMEZONE '] = 'Asia/Shanghai'  # 配置时区
    register_extensions(app)
    register_blueprints(app)
    configure_database(app)
    configure_logs(app)
    apply_themes(app)
    return app
