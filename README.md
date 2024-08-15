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

# diverged here with ChatGPT

````
<h3>Startup</h3>

Backend
```
rails s -p 3000
```
Front-End
```
npx webpack --watch --config ./webpack.config.js
```
http://127.0.0.1:3000/

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

<h3>Front-End Dev Docs/Guide<h3>
<p>
App layout starts in `/emotion-tracker/app/javascript/components/App.js`.
`App` references `Day`, which is a `Grid` containing 2 Grids containing `Calendar` and `EmotionTracker`.
`EmotionTracker` is rendered through `renderDayForm`, which renders a `Stack` of `Card`s through `renderPeriod`.
Each `Card` contains `CardContent` which wraps:
- `Typography` to display period name, <TextField>
- `TextField` to input emotion/affect
- `IconButton` to allow using the mouse to add the value 
</p>
