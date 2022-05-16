from os import path
import random

class NameGenerator():
	nouns = []
	adjectives = []

	def __init__(self):
		if path.isfile('nouns.csv'):
			file = open('nouns.csv')
		elif path.isfile('backend-3dt/nouns.csv'):
			file = open('backend-3dt/nouns.csv')
		
		for noun in file:
			if (noun[-1] == '\n'):
				self.nouns.append(noun[:-1].strip())
			else:
				self.nouns.append(noun.strip())

		if path.isfile('adjectives.csv'):
			file = open('adjectives.csv')
		elif path.isfile('backend-3dt/adjectives.csv'):
			file = open('backend-3dt/adjectives.csv')
		
		for line in file:
			adjective = line.split(',')[1].strip()
			if (adjective[-1] == '\n'):
				self.adjectives.append(adjective[:-1].strip())
			else:
				self.adjectives.append(adjective.strip())


	def get_random_username(self):
		adj_index = random.randrange(0, len(self.adjectives))
		noun_index = random.randrange(0, len(self.nouns))
		return self.adjectives[adj_index].capitalize()  + ' ' + self.nouns[noun_index].capitalize()



