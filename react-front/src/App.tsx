import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, BrowserRouter, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import UsersPage from './pages/UsersPage'; 
import UserFormPage from './pages/UserFormPage'; 
import TasksPage from './pages/TasksPage'; 
import TaskFormPage from './pages/TaskFormPage'; 
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import api from './api';
import Swal from 'sweetalert2';
import LogOut from './components/LogOut';
import TaskRegister from './components/RegisterTask';
import { User } from './utils/GetUser';

const App: React.FC = () => {
  const logged_user: User = {
    id: 0,
    name: '',
    email: '',
    password: '',
    group: '',
    username: '',
    image: 'data:image\/jpeg;base64,\/9j\/4AAQSkZJRgABAQEAYABgAAD\/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL\/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL\/wAARCADEAMQDASIAAhEBAxEB\/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL\/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6\/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL\/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6\/9oADAMBAAIRAxEAPwDtMU8dKTFOxWJmKtOpAKcKACl7UClpgANL2oxS96AFHWloxSigBaMUUdBTAKXvRRQFgoPSijNACYpp4p1NNK4DTR+NBppouFg5ooNJQAUHikoNAhRzRSAnFFAXIQKeOlJ3pwpDFFO7UClAoAMUuDijFLimAU4UlOFACYpeB3qOaZIYy7sFUDOSa4XxB8QIrYGLTwHbkF26D6etIdjs7vVbOwGbidEHua5m9+ImlwOUh3y4PUDANeS6hq1xqFw01xOzsx6ms9pRnjJNBSR7rY+OdHugN9ysRJwA\/Fb9vfW10uYJkkB\/utmvm6OVz0OPatTT9VurCVZLe5aNh2VsUahY+h+tNNee6N8R4SEg1KEoTgecpyPqa7yG5iuoFmhdXjcZVlOQaZNiQ9aaWpc0w0CFzSGk7U3NIB1JSZooAM0ZpO1FMBwooGcdKKBEdPFJS9qRQ4dKcKQU4UwCloooCwtBOBRXJePtak07SfssD7Z7nK5HUL3\/AMKBpHKeOfGIurhtPsnzbocOw\/iPsfSvOprh5GOT9KnuI2VSSefSqpQgAY5700jSwwuQcdacCR1HNOigLMWxwKeY8k5OKY0hgcdutLuNRnIPFN3uO+faloKzLUNx821jkdq7bwn4wl0WQW85Mlk55HdPcf4VwJ5XeB0qzay7wATzQ0Jo+j7e6hu7eOeB98cg3Kw7ipCa53wrKv8AY9vEr7gkYPXsScVul6kzaHmjOajLUbqBDyfSjNR7qA1AEtJ7UzcaXNAEgPHWimr0ooELTgKZThQUPFKKQU6mAU4U0U6gAxxXh\/jPWpNS1+do2zEhMcfpgd\/x617DrN4NP0W8utwBihZlz644\/WvApjvwzcHsaRpAhOcDfzTZQCcgUx1duhNWIbO8uQEht5JWzglV6U72NlG4yBCQVUVcg0iWY52nHvXU6F4MuFXz74CMnomea6M6bDCu1VA96hyNYwPPf7DIHK1Xn0cBfu4rvri2QL0rHuIh0AqecbgcJNatA\/I471Ci4kGOMV099ahwwx+Nc86GOQitE7mEonq\/gWaNNKZEOTkF\/rXWeaPWvLvA14Y7t4C3Ei8V6AJqm5g0aPm5PWlEgqgJKeslFybF4NTgaqLJ71KHppiLOaXNQA08MKYEyniimhhiigCWnAU0U8dKZQopwpAKWgApaMUUAVNTt1u9MuIHGVeMjFfPtwD5hH93jGK+i34Qk9AOa+ersFbi4IGMyMcenNI1po7HwnoFrNZia4jEhY8bq7CJbKyURr5UWP4RgVi6Mk8Phq18lf3joOT2z3qG4srZYmN1dMZW67WrJy1O2MdDpvPgdfllU59DVe4VcZFcPH9iS52R3cisD611tnG0kRk87euOKC0ivcBcYNZNxGoGSRTNavzExUvjBrmp7uS5fH2jaPrSSuTJmpOgYMVINcvqMPlTEkda00hZQCtyS3aq+sBjYiZh8yMA2KtGMh\/heRv7btgpPLc16eGz\/wDWrzfwZEJNWMn\/ADzjJH48f1NegqRTZyyLO6nrJxVcHmng1JBbV6sI\/vVFTU6NTAuBqkU1WUniplNUIsDpRSL0opiLfFLSCnUyh1FJS0DFoooNAEcqGSGRAcblK\/mK8H1K3eK6njkB8xZXVh7hjXvdeb+ONAeC7bVIBmKZv3gH8LHjP0NSzalubNqph0eGMcbYlH6VzVzYyzSSM9w6KR0A\/wDr110EXmW0fXGwfyqvPpAk55xWPU747HnsOilLnakskjM2cnmvQdOt2gtQknGBTLe0t7SZfl5zWisDTs2PkA6Z702yuWxwHia282VwvXtXH\/Z3XchkaNvXFeha5BtuGGcsDWPBbxXDFJYwSDjkU07GUoXOdhjmjKlZNx961bpDcaLcCReQm78q2f7MjiHEYAqG9gC2FxgY\/dNx+FHNqRKNkZfgkMl7LjOPK\/qK7xTxXK+E7J7azeZxgy7cfT\/JrplPOKo45FhTkZqQGq6njrUy0iCbtU0ZquKsJTAspzUy5PWoU6VOtUhEyY20U5RxRTEW6UdaQU7vQULiiilpgFJmlpKQBVLVbZbzTpoWTcGXpVymnkEUi4uzMrTo\/wDRIg3UKAatXQWOCmwx\/ZtyE8Ak\/hVXWmcWuVzjv9KzZ6FN3RmLGbm5JU8LzmorqC7k1Bbpry4SKEfLDGQqH6+tSRajaRIIvMEfHcdfxqC91K08gxi4Xn\/bApG6VzmNbkuJL6K53yKgOcKRhvrTtMnjkvi8oCrIePaory\/tWxD5qkIMAhwc\/lWb9rXfiJXfH+zgfnQS1Y7S5iHlkgYFZM0fmwyRk43Db+fFaNpIx0iNpTkkdPaqaDzJQByCaLGFR6FpUWFFjQYVRgD0qRTUbnmnKeao4ZblhTUwNV1NTKaCCwvNWFOMVWjNWl5FMCynrUyc1CnAqeOqQiwoO2ihc470UwLY54p2KQdafTGIBS4oFBoAQ0lLSUgENJS96Q9KBleUYmDdjxUV1GJIWUjORVlwCDUAYsMnqOtQ0dlGWhlRWgG5HQbPQiqGp2dmYuFG72FdI0SyDtzVCeyRVYlQBUHZGRw1zYwBchVGO+Kz\/KAbgcV02o2gCFgaw1Tnmi5MmX9\/+hxoD0FT2cWIy5+gqirHpWquEjC+goRy1ZFd\/vmnKabJ96lWqOVlhDUy1AnSp1NBLJ05q5HmqkYq5H2xTEToKnQYNQr6VOtNAWF+7RSKfl60UwsXu9PxxSEc04dKoYmKDTscUhFADTTacRSUAMpp6U+qWpX8Om2E95NuKQruIXqe2Kai2BOelU0kVmLKQVJ7Vxth4xutX1aWMFbe3aP5I+pBB5O715rptIw+mWx\/6ZL\/ACFTUg47nRRNIEDlTVK9uA67TkVM2RVC5ZvY1idiZmXs0Zg2ZyawjH36AVs3RGDxWLct82OaBMjMmHBHQVqJMssSupyrAEVhO4QEk4AGSaoWesyWmkJKdrKrEbG6kZ6A\/wD66uMbnLUOpfk05BxVPTtRt9UjZ7YsSmN6kcrn1q+q0OLRz3HoOKsItRIDVuJOKQiWJeKtotRRr3qyopiHrUqU0DvUgpgSr0opFOB0opjNNhzSilNAFVYAoNL2prEKuTRYBDUTyKnU0x5mc4Xiotm+QL19apRGDStI2F4FNlso7y2ltpo1kilUq6nuD71eSBfMxjoKkMJXnpWsVYDwXXNHufDurSWshfbyYpRxvU9\/6Gu08EavHPp32F3HnW5wFJ5KHof6fhXYa7oNrr1i1vdIQRzHIv3o29R\/hXjmu6TceG9TtHjuGYyKcSKChUg4racVUjYIScHc9hbDLVCda4rSfHs0KCPUYfPXp5seA34jof0rbXxfo1x0uCh9JFIxXFOhOPQ641osfcxZzzWHdFUJHetK68R6MsZP2yNj\/sgt\/KuN1PxCssjfZIz7M4\/pSjRk3sEq0UizcZnmjthx5hy\/so5NcrO7SSmCMsY1chFHfn+dT2kl9PqK+TIWuJj5YyeDu4x9K9M8OeC7fR1W6uCJ7zH3v4U\/3f8AH+VdEYKC1OWc+ZkHg\/w8+lWDSXC4ubjBZf7gHQfXk5roXsY3HK4PqKuBBnFWkiGwkiokrknPSWckXK\/MtETAdeK6R7UGMNjtVG4sVcZxg9iKzcRlaNhjrVlGrNcPbvsfp2PrU8U\/bNRsI0AeKeKrJJUwOaAJQ3HWimr0opgbR+9S0lL2qwChYTIwYjgU5U3tj0q4qhSB61cUMyZIhHdSY6AZot1IO\/1qa8X\/AEhvcCpIY+BxV2AeBg7vanBdzZNOCVKFxyRTAQooXpXk\/iCWGTxymm3trHJbLLlS3dXXP8z+leryNxXlXxEha38R6ffqMBowCR6q2f5EVpETRf1H4W6fcr5unXclqSM7HG9fwPUfrXOXHww12Jv3UtpKOxEhH8xXrGmyedYQPnOUFWm+lV7RonlPGI\/hjrrn949nGPVpSf5Ctmy+Gdlar52p3bXG0ZMcY2J+J6kflXpJHFcp431ZNJ0NgQWa4cRBQcEqfvfpkfiKPaNhynGeHdFSXxm12sCx2kaGWFFGAAflXj6ZNelGIGLGO1YfhuISWTagFIF026MEYIjHC10sGJFxWUnqUjK5V8H1q8vMYAqvdRmOU1Jbv0GagovTDFox9qrYDxLj0q9Iu+zYe1Zlm+TtPY0CIdXtlDIhGNyZzWAcxPtPBFdNrfN1AP8Apn\/WsC9jCsr\/AIGsZoB8MvvV1Gz71kxnmr8LcVmBfU\/LRUStxRTEdDmkJpmaXNaDLNudqs3pVq4T5Ay9QarRAm0c1eixJGp9VBraKAoTxl7mpdoUYHWp3QKWc0yKMkea3foKoBAuBk9aASTUhUk01\/lT3NAED\/M2BWP4ghQ2alyArbo2J6AMp\/qBW2ik81jeKLU3vh+\/gUZbySy\/VfmH6iqQFTwncGbSIkY5eLKN9Rx\/StyQ8iuF+G9yXjuLcn7p3D8a7sDdIaJKzEhh4FeTeMpX8QeNbfSIGzHCREcf3jyx\/AYH4V6rfyi1tJpyM7FJA9T2H51yOh6TC\/iOS+ZQ0tvGFeT+9I3J\/Ln86FoB0P2aO2t44Y12xxoFUegFLaNiSrVwmYyQKox8HPoahjRY1KHMQcCsyJsEVvFRcWhX2rAI8uVlPY1IzctWEkJHtWLA3l30iHs1XtPmxJtJ4NUrtRFrcg\/vKGoEP1Jw9+i9T5fHtzWTerkOO45q4W87Umb+6oFV7zHnyCokgMtWxVyBsCqGdrEHqDVqA1gM0lPy0U1D8tFAjo6KKK2W4GhbgG3I9jU2n82qZ7Ej9aKK2jsA69+4B6mp2UAAY6CiiqENwKrS\/wCsxRRSGOAAWqsihiVIyDwRRRVIDzHwETF4onhQ4Ty3GPoeK9Nh\/wBY1FFVPcSOR+JN5PZ+H4TbyGNpLpAWU84AZv5gVb8HEzeGILuTma5ZpZW9WLEf0oopPYSN2TmI1mDr+NFFZMs0LRjjFZmqoqkuOGzRRSYEVm58wGjVD\/xNIT3KUUUdBFW2\/wCPiQ+9V7jm4looqZAZc3Fw+PWprfrRRXOM0E+7RRRQB\/\/Z'
  }
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loggedUser, setLoggedUser] = useState<User>(logged_user);
  const location = useLocation();
  const darkm = useState(false);
  useEffect(() => {
    const checkAuth = async () => {
      Swal.showLoading();

      if (sessionStorage.getItem('token')) {
        api.defaults.headers.common['Authorization'] = `Bearer ${sessionStorage.getItem('token')}`;
        try {
          const response = await api('/logged');
          let data = response.data;
          if (data.auth) setIsAuthenticated(true);

          setLoggedUser({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            password: data.user.senha,
            group: data.user.group,
            username: data.user.username,
            image: data.user.image,
          })
        } catch (error) {
        }
      } else {
        setIsAuthenticated(false);
      }

      Swal.close();
    };

    checkAuth();
  }, [location.pathname]);

  

  return (
    <div>


        <Navbar auth={isAuthenticated} loggedUser={loggedUser}/>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Home loggedUser={loggedUser}/> : <Navigate to="/login" />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login setAuth={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />

          {isAuthenticated ? (
            <>
            
              <Route path="/register/task" element={parseInt(loggedUser.group) >= 10 ? <TaskRegister /> : <Navigate to={'/'}/>} />
              
              <Route path="/users/:id" element={parseInt(loggedUser.group) >= 10 ? <UserFormPage /> : <Navigate to={'/'}/>} />
              <Route path="/tasks/:id" element={<TaskFormPage /> } />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/logout" element={<LogOut />} />
              
              <Route path="/tasks" element={<TasksPage />} />

            </>
          ) : (
            <Route element={<Navigate to="/" />} />
          )}
        </Routes>
      
    </div>
  );
};

export default App;
