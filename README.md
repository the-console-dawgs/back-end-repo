## The application:
Survey Says! is a full-stack application used for creating
a custom survey and displaying the results on the dashboard.

Simply sign up to create and account. Sign in to start creating your own custom
surveys. From your dashboard you can create, view, edit and delete custom surveys.
surveys. Other registered users can then respond to our survey and the results
are displayed.


## Links:
Back end repo: <https://github.com/the-console-dawgs/back-end-repo>
Front end repo: <https://github.com/the-console-dawgs/front-end-client>

Front end deployed: <https://the-console-dawgs.github.io/front-end-client/>
Back end deployed: <https://guarded-springs-12986.herokuapp.com/>

## Technology
For this application we used:

javascript, html, css, boostrap, handlebars, mongodb, mongoose, express

## Unsolved Problems
We would like to be able to create surveys that contain responses other
than simply true or false values.
We would also like to be able to update the resuts dashboard in real time.

## Wireframes and User stories

Wireframe: <https://imgur.com/RhZ6MS6>
User stories: <https://github.com/the-console-dawgs/front-end-client/projects/1#column-3054488>

Database ERD: <https://i.imgur.com/pkEFywA.jpg>

## Routes and Paths

User Routes: Sign Up POST /sign-up
             Sign In POST /sign-in
             Change Password PATCH /change-password
             Sign Out DELETE /sign-out

Survey Routes: Create POST /surveys
               Get All   GET /surveys
               Delete DELETE /surveys/:id
               Update PATCH /surveys/:id

Response Routes: Create POST /responses
                 Get responses GET /surveys/ + data.survey



## Planning, Process & Problem-solving

We planned our project using user stories, an ERD diagram and a wireframe.
We then made a list of to-dos for the back end as well as the front end.
We randomly chose a leader for each day to spearhead the operations and each person took on either the front end or the back end.
When we ran into an issue that we were not familiar with, we all grouped back together to attack the problem. This allowed
us all to learn and contribute our possible solutions.
We made it a point to slack out a message each time we made a pull request in order to alert our teammates that they would need to pull down the latest development branch.
