
import sys 
import os
import importlib.machinery


import sublime, sublime_plugin, http, json



settings_filename = "codestream.sublime-settings"
on_modified_field = "codestream_on_modified"

settings = sublime.load_settings(settings_filename)


class CodestreamCommand(sublime_plugin.TextCommand):

	def run(self, edit): 

		if settings.get(on_modified_field):
			settings.set(on_modified_field, False)
			sublime.status_message("CodestreamCommand Turned Off")
			print("codestream off")
		else:
			settings.set(on_modified_field, True)
			sublime.status_message("CodestreamCommand Turned On")
			print("codestream on")

			print(self.view.substr(sublime.Region(0, self.view.size())))

class MyEventListener(sublime_plugin.EventListener):    
	def on_modified_async(self, view):
		if settings.get(on_modified_field):
			print("Modified file - sending")  
			connection = http.client.HTTPConnection('localhost:1337')
			# print(view.file_name())
			fulltext = view.substr(sublime.Region(0, view.size()))

			headers = {'Content-type': 'application/json'}

			update = {'page': fulltext, 'file': view.file_name()}
			# print(update)
			json_body = json.dumps(update)

			connection.request('POST', '/api/file_update', json_body, headers)


