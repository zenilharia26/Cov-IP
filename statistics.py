import csv
import os
from bs4 import BeautifulSoup
from urllib.request import urlopen, Request

url = 'https://www.worldometers.info/coronavirus/'
headers = {'User-Agent' : 'Mozilla'}

request = Request(url, headers = headers)

httpResp = urlopen(request)

soup = BeautifulSoup(httpResp, 'lxml')

table = soup.find('table', attrs={ "id" : "main_table_countries_today"})

rows = []

header = [a.text for a in table.find_all('th')]
print(header)

for row in table.find_all('tr'):
	rows.append([val.text for val in row.find_all('td')])

abs_file_path = os.path.abspath(__file__)
csv_file_path = abs_file_path.replace(abs_file_path.split('/')[-1], '') + 'corona_details.csv'
print(csv_file_path)
with open(csv_file_path, 'w') as f:
	print('csv file generated')
	writer = csv.writer(f)
	writer.writerow(header)
	writer.writerows(rows)
