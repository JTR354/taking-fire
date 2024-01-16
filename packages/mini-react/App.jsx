/**@jsx CReact.createElement */
import CReact from "./core/react.js";

const Child = () => {
  return <div>child</div>;
};

const Counter = ({ num }) => {
  return (
    <div>
      {num}
      <Child></Child>
    </div>
  );
};

const App = () => (
  <div className="red">
    <h1>mini-react</h1>
    <input placeholder="mini-react" />
    <button>add</button>
    <Counter num={1} />
    <Counter num={12} />
  </div>
);

export default App;
