import { useState } from "react";


function Checklist({ tasks = [] }) {

  const [completed, setCompleted] = useState([]);


  const toggleTask = (index) => {

    if (completed.includes(index)) {

      setCompleted(
        completed.filter(item => item !== index)
      );

    } else {

      setCompleted([
        ...completed,
        index
      ]);

    }

  };


  if (tasks.length === 0) {

    return (
      <div className="result-card">

        <h3>✅ Event Checklist</h3>

        <p>
          AI-generated checklist will appear here.
        </p>

      </div>
    );

  }


  return (

    <div className="result-card">

      <h3>
        ✅ Event Checklist
      </h3>


      {tasks.map((task, index) => (

        <div
          className="check-item"
          key={index}
          onClick={() => toggleTask(index)}
        >

          <input
            type="checkbox"
            checked={completed.includes(index)}
            onChange={() => toggleTask(index)}
          />

          <span
            className={
              completed.includes(index)
                ? "completed"
                : ""
            }
          >
            {task}
          </span>

        </div>

      ))}

    </div>

  );
}


export default Checklist;