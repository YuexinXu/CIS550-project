import mysql.connector


class Vaccine(object):
    def __init__(self):
        self.db_connect = None
        try:
            self.db_connect = mysql.connector.connect(
                host="cis550-proj.ce4rgkfty1r4.us-east-1.rds.amazonaws.com",
                user="admin",
                password="cis550ok",
                database="cis550"
            )
        except Exception as e:
            print(f"failed to create database connection, {str(e)}")

    def query_states(self):
        query = f'''
             SELECT location
            FROM vaccination
            Group by 1
        '''
        cursor = self.db_connect.cursor()
        cursor.execute(query)
        states = []
        for state in cursor.fetchall():
            states.append(state[0])
        return states

    def query_date(self):
        query = f'''
                SELECT Date
                FROM vaccination
                Group by 1
                '''
        cursor = self.db_connect.cursor()
        cursor.execute(query)
        dates = []
        for date in cursor.fetchall():
            dates.append(date[0])
        return dates

    def query_vaccinated_num_by_state(self, state, date):
        query = f'''
            SELECT location, cases, cases/TotalPop as infection_rate, deaths, deaths/TotalPop as death_rate,
            vaccinated, vaccinated/TotalPop as normalized_population 
            FROM (
                (SELECT * FROM
                (SELECT location, sum(people_vaccinated) as vaccinated 
                FROM vaccination 
                WHERE location = '{state}' and Date = '{date}'
                GROUP BY location) as t1 JOIN 
                (SELECT State, sum(TotalPop) as TotalPop 
                FROM demographic
                GROUP BY State) as t2 
                ON t1.location = t2.State) as t3 JOIN
                (SELECT State, sum(deaths) as deaths, sum(cases) as cases 
                FROM cases
                WHERE Date = '{date}'
                GROUP BY State) as t4
                ON t3.location = t4.State
            )
        '''
        cursor = self.db_connect.cursor()
        cursor.execute(query)
        result = list(cursor.fetchall())
        if len(result) == 0 or len(result) > 1:
            return {"error": f"result length {len(result)} is not 1, state value {state} may not be correct!"}
        result = result[0]
        return {
            "vaccinated": [{
                "location": result[0],
                "cases": str(result[1]),
                "infection_rate": str(result[2]),
                "deaths": str(result[3]),
                "death_rate": str(result[4]),
                "vaccinated": str(result[5]),
                "normalized_population": str(result[6])}]
        }

    def query_state_info(self, state):
        query = f'''
            SELECT Date, sum(deaths) as deaths, sum(cases) as cases 
            FROM cases
            WHERE State = '{state}'
            GROUP BY 1
            ORDER BY Date
        '''
        cursor = self.db_connect.cursor()
        cursor.execute(query)
        res =[]
        for item in cursor.fetchall():
            res.append({"Date": item[0], "Deaths": str(item[1]), "Cases": str(item[2])})
        return {
            "StateInfo": res
        }

    def query_icu_capacity(self, state):
        query = f'''
            SELECT State, County, sum(ICU_Beds) as ICU_Beds
            FROM ICU
            WHERE State = '{state}'
            GROUP BY 1,2
        '''
        cursor = self.db_connect.cursor()
        cursor.execute(query)
        result = list(cursor.fetchall())
        icu_res = []
        for item in result:
            icu_res.append({"State": item[0], "County": item[1], "ICU_Beds": str(item[2])})
        return {
            "ICU": icu_res
        }

    def query_demo_analysis(self):
        query = f'''
            SELECT t1.State as State, cases / TotalPop as infection_rate, Hispanic, White, Black, Asian, Avg_Income, Unemployment_rate
            FROM (
                (SELECT State, sum(cases) as cases 
                FROM cases
                WHERE Date = '2021-03-27'
                GROUP BY State) as t1 JOIN 
                (SELECT d.State,
                SUM(d.TotalPop) as TotalPop,
                SUM(d.Hispanic* d.TotalPop)/SUM(d.TotalPop) as Hispanic, 
                SUM(d.White* d.TotalPop)/SUM(d.TotalPop) as White, 
                SUM(d.Black* d.TotalPop)/SUM(d.TotalPop) as Black, 
                SUM(d.Asian* d.TotalPop)/SUM(d.TotalPop) as Asian, 
                SUM(d.IncomePerCap * d.TotalPop)/SUM(d.TotalPop) as Avg_Income, 
                SUM(d.Unemployment * d.TotalPop)/SUM(d.TotalPop) as Unemployment_rate
                FROM demographic as d
                GROUP BY State) as t2
                ON t1.State = t2.State
            )
            ORDER BY infection_rate DESC 
        '''
        cursor = self.db_connect.cursor()
        cursor.execute(query)
        result = list(cursor.fetchall())
        demo_res = []
        for item in result:
            demo_res.append({
                "State": item[0],
                "infection_rate": str(item[1]),
                "Hispanic": str(item[2]),
                "White": str(item[3]),
                "Black": str(item[4]),
                "Asian": str(item[5]),
                "Avg_Income": str(item[6]),
                "Unemployment_rate": str(item[7]),
            })
        return {
            "demo": demo_res
        }