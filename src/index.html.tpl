<!DOCTYPE html>
<html lang="en">
  <head>
    <title>JIRA Task Board Helper</title>
    <meta charset="utf-8">
    <% for (var css in htmlWebpackPlugin.files.css) { %>
    <link href="<%= htmlWebpackPlugin.files.css[css] %>" rel="stylesheet">
    <% } %>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
