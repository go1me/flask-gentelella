from flask import Blueprint

blueprint = Blueprint(
    'ctf_blueprint',
    __name__,
    url_prefix='/ctf',
    template_folder='templates',
    static_folder='static'
)
