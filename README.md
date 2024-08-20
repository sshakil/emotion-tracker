<h1>Emotion Tracker</h1>
<h3>What</h3>
<p>
   Provides a calendar date picker and a custom form to track emotions through the various periods of the day.
</p>
<p>
   A pet project in <a href="https://rubyonrails.org/" target="_blank">Ruby on Rails (RoR)</a>, <a href="https://react.dev/" target="_blank">ReactJS</a>, <a href="https://mui.com/x/react-date-pickers/date-picker/" target="_blank">MUI</a>, and MUI X.
</p>
<p>
   Supports keyboard tab/shift-tab traversal, backspace/delete, and enter key functionality.
</p>

<h3>Why</h3>
<p>
   I started this a couple of years ago as a means to keep my coding skills alive upon taking a break from full-time work and pursuing graduate studies.
</p>
<p>
   Upon my graduation with <a href="https://catalogue.uottawa.ca/en/graduate/master-engineering-engineering-management/#Requirementstext">Master's in Engineering, Management</a> (similar to an MBA) in June 2024, I resumed working on this part time to refamiliarize myself with the full-stack web application development through the MVP framework.
</p>
<p>
   Also, I just find coding enjoyable, espcially more so now with AI making it easier and more effective in some ways!
</p>

<h3>AI-assisted Coding</h3>
<p>
   I experimented usage of <a href="https://chat.openai.com/" target="_blank">ChatGPT Plus</a>, 
<a href="[https://www.jetbrains.com/idea/whatsnew/#ai-assistant](https://www.jetbrains.com/help/idea/ai-assistant.html)" target="_blank">JetBrains's AI Assistant</a>, 
<a href="https://github.com/kicoe/CodeGPT" target="_blank">CodeGPT plugin</a> in JetBrains IDEs (including RubyMine, WebStorm, and PyCharm that I use), 
<a href="https://github.com/TheR1D/shell_gpt" target="_blank">the Shell GPT plugin</a> on iTerms with ZSH, 
<a href="https://github.com/features/copilot" target="_blank">Co-Pilot</a>, 
<a href="https://blog.google/technology/ai/next-generation-ai-for-google-and-developers/" target="_blank">Gemini Advanced</a> later in the project.
</p>
<p>
   I found myself using the native ChatGPT app the most due to the ability to resume particular conversations with most enriched context.
</p>
<p>
   I've learned a few things along the way about how to effectively use AI in aiding development.
</p>
<p>
   As it's a pet project, I didn't mind letting ChatGPT have full knowledge of my code. For business use, I would only use an enterprise account which wouldn't be training their models.
</p>


<h2>Setup and Run</h2>
<p>
   This assumes you can use MacOS package manager <code>brew</code> on the CLI to install <code>postgresql</code> and <code>git</code>, update RubyGems(<code>gem</code>) to install </code>bundler</code>, Ruby on Rails, and <code>npm</code> to install MUI, among other libraries.
</p>

<h3>Clone the Repo</h3>

```
git clone git@github.com:sshakil/emotion-tracker.git
```

<h3>Change Directory to emotion-tracker</h3>

```
cd emotion-tracker
```
<p>
   As it's an RoR project which typically starts from the Model layer in the Model-View-Controller (MVP) approach and goes up, let's setup the DB first.
</p>

<h3>Database Setup</h3>
<h4>Start PostgreSQL</h4>
As system daemon

```
brew services start postgresql@15
```
Or, manually
```
pg_ctl -D /usr/local/var/postgres start
```

<h4>Create Databases, User, and grant Privileges</h4>
This creates the development and test databases, creates the user 'demo' and grants it all privileges (create schema, read, write, etc).
The first two GRANTs didn't work for `rails db:migrate` (run later), as likely one or both of the last two were needed. Leaving in to maybe investigate later.

```
createdb emotion_tracker
createdb emotion_tracker_test
psql -d emotion_tracker
CREATE USER demo WITH PASSWORD <password>;
GRANT ALL PRIVILEGES ON DATABASE emotion_tracker TO demo;
GRANT ALL PRIVILEGES ON SCHEMA public TO demo;
ALTER SCHEMA public OWNER TO demo;
GRANT CREATE ON SCHEMA public TO demo;
```
<h4>Create Schema and Seed Data</h4>
This is done before starting the Rails server and attempting to load the app as current date seed will clash due to current setup (todo: check if seed date is needed/remove it):

```
rails db:migrate
rails db:seed
```

<h3>Front-End Setup</h3>
Install Javascript libraries

```
npm install
```

<h3>Backend Setup</h3>

Install Gems

```
bundle install
```

<h3>Run</h3>

<h4>Backend</h4>

```
rails s -p 3000
```
<h4>Front-End</h4>

```
npx webpack --watch --config ./webpack.config.js
```

<h4>Load the App</h4>

Visit:<br>

```
http://127.0.0.1:3000/
```

<h2>Project Initialization</h2>

Started with Yarn and SQLite then switched to npm and PostgreSQL later.
```
https://www.freecodecamp.org/news/how-to-create-a-rails-project-with-a-react-and-redux-front-end-8b01e17a1db/

brew install node
npx create-react-app my-app --template typescript
cd emotion-tracker-front
git branch -M main
echo "\n.idea" >> .gitignore
git add .
git commit -m "init + gitignore"
git remote add origin git@github.com:sshakil/emotion-tracker-front-end.git
git push -u origin main

yarn add react_ujs
yarn add react-dom
yarn add react

https://gorails.com/forum/error-in-chunk-application-entry-js-name-contenthash-js-cannot-use-chunkhash-or-contenthash-for-chunk-in
config/webpack/development.js
add:
const config = environment.toWebpackConfig();
config.output.filename = "js/[name]-[hash].js

# diverged here with ChatGPT here

```

<h3>Issues</h3>
formatted date conversion issue

```
return (
   <StaticDatePicker
     orientation="portrait"
     openTo="day"
     value={ convertDateStringToDate(selectedDate) }
     onChange={ (newSelectedDate) => {
         // todo - these strips timezone info, which will be added back later
         // const date = newValue.toISOString().split('T')[0] - this one has a day ahead issue
         // const formattedDate = newSelectedDate.toLocaleDateString()
         // backend needs format: "2022-10-01" (oct 1); front with toLocaleDateString() gives mm/dd/yyyy
         // this converts it to needed format
         // https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
         // should be done on server side?
         const date = convertToYYYYMMDD(newSelectedDate)
         // console.log("StaticDatePicker - onChange: newSelectedDate, formattedDate: ", newSelectedDate, formattedDate)
         console.log("onChange: ", date)
         dispatch(fetchDayIfNotInStore(date))
         dispatch(setSelectedDate(date))
       }
     }
     renderInput={ (params) => <TextField { ...params } /> }
   />
);
```

<h3>Front-End Dev Docs/Guide</h3>
App layout starts in <code>/emotion-tracker/app/javascript/components/App.js</code>.

<code>App</code> references <code>Day</code>, which is a <code>Grid</code> containing 2 Grids containing <code>Calendar</code> and <code>EmotionTracker</code>.

<code>EmotionTracker</code> is rendered through <code>renderDayForm</code>, which renders a <code>Stack</code> of <code>Card</code>'s through <code>renderPeriod</code>.

Each <code>Card</code> contains <code>CardContent</code> which wraps:
- <code>Typography</code> to display period name, <TextField>
- <code>TextField</code> to input emotion/affect
- <code>IconButton</code> to allow using the mouse to add the value 


<h3>Backend Controllers</h3>
<code>Entries</code> is what connects a <code>day_period</code> with an <code>emotion</code>


<h2>DB</h2>
Started switching to PG on 19/08/2024.

