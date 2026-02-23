import Caseboard from "./components/CaseBoard";
import { useState } from "react";
import type { Case } from "./types/clues";
import { useCases } from "./custom_hooks/useCasesSelectors";

function App() {
    const [caseTitle, useCaseTitle] = useState("");

    const { allCases, pinCase } = useCases();

    function addCase() {
        const newCase: Case = {
            id: crypto.randomUUID(),
            title: caseTitle,
        };

        pinCase(newCase);
    }

    return (
        <>
            <h1>Main page</h1>
            <form>
                <label>
                    <input
                        type="text"
                        placeholder="Case #"
                        value={caseTitle}
                        onChange={(event) => useCaseTitle(event.target.value)}
                    />
                </label>
            </form>
            <button onClick={addCase}>Add case</button>

            <div className="CaseContainer">
                {allCases.map((element) => (
                    <Caseboard data={element} key={element.id}></Caseboard>
                ))}
            </div>
        </>
    );
}

export default App;
