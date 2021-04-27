from flask import Flask

from api.db_helper_vaccine import Vaccine

app = Flask(__name__)


@app.route('/states')
def get_states():
    db_helper = Vaccine()
    return {'states': db_helper.query_states()}


@app.route('/demographic')
def get_demo():
    db_helper = Vaccine()
    return db_helper.query_demo_analysis()


@app.route('/date')
def get_dates():
    db_helper = Vaccine()
    return {'dates': db_helper.query_date()}


@app.route('/state/<state>')
def get_state_info(state):
    db_helper = Vaccine()
    return db_helper.query_state_info(state)


@app.route('/vaccinated/<state>/<date>')
def get_vaccinated_num_by_state(state, date):
    db_helper = Vaccine()
    return db_helper.query_vaccinated_num_by_state(state, date)


@app.route('/icu/<state>')
def get_icu_capacity_by_state(state):
    db_helper = Vaccine()
    return db_helper.query_icu_capacity(state)
