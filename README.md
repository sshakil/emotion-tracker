<h1>Emotion Tracker</h1>
<h3>What</h3>
<p>
   Provides a calendar date picker and a custom form to track emotions through the various periods of the day.
</p>
<p>
   A pet project in Ruby on Rails (RoR), ReactJS, MUI, and MUI X.
</p>
<p>
   Supports keyboard tab/shift-tab traversal, backspace/delete, and enter key functionality.
</p>

<h3>Why</h3>
<p>
   I started this a couple of years ago as a means to keep my coding skills alive upon taking a break from full-time work and pursuing graduate studies.
</p>
<p>
   Upon my graduation with Master's in Engineering, Management (similar to an MBA) in June 2024, I resumed working on this part time to refamiliarize myself with the full-stack web application development through the MVP framework.
</p>
<p>
   Also, I just find coding enjoyable, espcially more so now with AI making it easier and more effective in some ways!
</p>

<h3>AI-assisted Coding</h3>
<p>
   I experimented usage of ChatGPT Plus, IntelliJ's AI Assistant, CodeGPT plugin in RubyMine, the <code>sgpt</code> plugin on the CLI, Co-Pilot, and Gemini Advanced later in the project.
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
   This assumes you can use MacOS package manager `brew` on the CLI to install `postgresql` and `git`, update RubyGems to install `bundler`, Ruby on Rails, and `npm` to install MUI, among other libraries.
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
App layout starts in `/emotion-tracker/app/javascript/components/App.js`.

`App` references `Day`, which is a `Grid` containing 2 Grids containing `Calendar` and `EmotionTracker`.

`EmotionTracker` is rendered through `renderDayForm`, which renders a `Stack` of `Card`s through `renderPeriod`.

Each `Card` contains `CardContent` which wraps:
- `Typography` to display period name, <TextField>
- `TextField` to input emotion/affect
- `IconButton` to allow using the mouse to add the value 


<h3>Backend Controllers</h3>
`Entries` is what connects a `day_period` with an `emotion`


<h2>DB</h2>
Started switching to PG on 19/08/2024.

