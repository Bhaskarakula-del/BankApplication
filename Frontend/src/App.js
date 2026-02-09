import {Switch, Route} from 'react-router-dom'
import MyYellowAi from './components/MyYellowAi';

const App = () => (
    <Switch>
        <Route path="/" exact component={MyYellowAi} />
    </Switch>
)

export default App;
