<h1>Emotion Tracker</h1>
<h3>What is it</h3>
Provides a calendar date picker and a custom form to track emotions through the various periods of the day.

A pet project in Ruby on Rails (RoR), ReactJS, MUI, and MUI X.

<h3>Rationales</h3>
I started this a couple of years ago as a means to keep my coding skills alive upon taking a break from full-time work and pursuing graduate studies.
Upon my graduation with Master's in Engineering, Management (similar to an MBA) in June 2024, I resumed working on this part time to refamiliarize myself with the full-stack web application development through the MVP framework.

Also, I just find coding enjoyable, espcially more so now with AI making it easier and more effective in some ways!

<h3>AI-assisted Coding</h3>
I experimented usage of ChatGPT Plus, IntelliJ's AI Assistant, CodeGPT plugin in RubyMine, the `sgpt` plugin on the CLI, Co-Pilot, and Gemini Advanced later in the project. I found myself using the native ChatGPT app the most due to the ability to resume particular conversations with most enriched context. I've learned a few things along the way about how to effectively use AI in aiding development. As it's a pet project, I didn't mind letting ChatGPT have full knowledge of my code. For business use, I would only use an enterprise account which wouldn't be training their models.

Supports keyboard tab/shift-tab traversal, backspace/delete, and enter key functionality.

<h2>Running the App</h2>

This assumes you can use MacOS package manager `brew` on the CLI to install `postgresql` and `git`, update RubyGems to install Ruby on Rails, and `npm` to install MUI, among other libraries.

Clone the Repo
`git clone git@github.com:sshakil/emotion-tracker.git`

Change Directory to emotion-tracker
`cd emotion-tracker`

As it's an RoR project which typically starts from the Model layer in the Model-View-Controller (MVP) approach and goes up, let's setup the DB first.

Start PostgreSQL
Daemon
```
brew services start postgresql@15
```
Manual:
```
pg_ctl -D /usr/local/var/postgres start
```

Create the Development and Test Databases, Create the D
The first two GRANTs didn't work for `rails db:migrate`, probably one or both of the last two were needed:
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

Run the following before starting server and hitting the app (otherwise current date seed will clash):
```
rails db:migrate
rails db:seed
```



Install Javascript libraries
```
npm install
```



Backend
```
rails s -p 3000
```
Front-End
```
npx webpack --watch --config ./webpack.config.js
```
http://127.0.0.1:3000/


<h2>Project Initialization</h2>

Started with Yarn and SQLite then switched to npm and PostgreSQL later.
````
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

````

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

