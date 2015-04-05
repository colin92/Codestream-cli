import sys 
import os
import importlib.machinery

import sublime, sublime_plugin, json
from http import client

settings_filename = "codestream.sublime-settings"
on_modified_field = "codestream_on_modified"
codestream_url_field = "codestream_url"
settings = sublime.load_settings(settings_filename)


class CodestreamCommand(sublime_plugin.TextCommand):

  def run(self, edit):
    if settings.get(codestream_url_field) == "localhost:1337":
      settings.set(codestream_url_field, "codestream.co")
      sublime.status_message("CodestreamCommand Turned On")
      print("codestream on")
    elif settings.get(on_modified_field):
      settings.set(on_modified_field, False)
      sublime.status_message("CodestreamCommand Turned Off")
      print("codestream off")
    else:
      settings.set(codestream_url_field, "codestream.co")
      settings.set(on_modified_field, True)
      sublime.status_message("CodestreamCommand Turned On")
      print("codestream on")

class CodestreamLocalCommand(sublime_plugin.TextCommand):

  def run(self, edit):
    if settings.get(codestream_url_field) == "localhost:1337":
      settings.set(on_modified_field, False)
      settings.set(codestream_url_field, "codestream.co")
      sublime.status_message("Codestream Dev Mode Turned Off")
      print("codestream dev off")
    else:
      settings.set(codestream_url_field, "localhost:1337")
      settings.set(on_modified_field, True)
      sublime.status_message("Codestream Dev Mode Turned On")
      print("codestream dev on")

class MyEventListener(sublime_plugin.EventListener):    
  def on_modified_async(self, view):
    if settings.get(on_modified_field):
      print("Modified file - sending")  
      url = settings.get(codestream_url_field)
      connection = client.HTTPConnection(url)
      fulltext = view.substr(sublime.Region(0, view.size()))
      pos = view.rowcol(view.sel()[0].begin())
      variables = view.window().extract_variables()

      headers = {'Content-type': 'application/json'}

      update = {'page': fulltext, 'file': view.file_name(), 'line': pos, 'folder': variables['folder']}

      json_body = json.dumps(update)

      connection.request('POST', '/api/file_update', json_body, headers)

