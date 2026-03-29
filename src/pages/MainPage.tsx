import { useContext } from "react";
import { authContext } from "../context/authContext";

import { useCases } from "../custom_hooks/useCasesSelectors";

import { useNavigate } from "react-router-dom";

export default function Main() {
    const userContext = useContext(authContext);
    const navigate = useNavigate();
    const { allCases } = useCases();

    if (!userContext?.authInfo) {
        return (
            <>
                <div>Sign up or login to an existing user</div>
            </>
        );
    }

    return (
        <>
            <h1>My cases</h1>

            <div>
                <div className="CaseDisplay">
                    <div>
                        All cases:{" "}
                        <span style={{ color: "#5A5146" }}>
                            {allCases.length}
                        </span>
                    </div>
                    <div>
                        Cases solved:{" "}
                        <span style={{ color: "#5A5146" }}>
                            {
                                allCases.filter(
                                    (value) => value.status == "solved",
                                ).length
                            }
                        </span>
                    </div>
                    <div>
                        Cases in progress:{" "}
                        <span style={{ color: "#5A5146" }}>
                            {
                                allCases.filter(
                                    (value) => value.status === "in-progress",
                                ).length
                            }
                        </span>
                    </div>
                    <div>
                        Postponed cases:{" "}
                        <span style={{ color: "#5A5146" }}>
                            {
                                allCases.filter(
                                    (value) => value.status == "postponed",
                                ).length
                            }
                        </span>
                    </div>
                </div>

                <div className="CaseContainer">
                    {allCases.map((value) => {
                        return (
                            <div
                                key={value.id}
                                onClick={() => {
                                    navigate(`/case/${value.id}`);
                                    userContext?.setActiveCase(value.id);
                                }}
                                className="CaseLink"
                            >
                                <div className="CaseLinkTitle">
                                    {value.title}
                                </div>
                                <div className="CaseLinkStatus">
                                    Status:{" "}
                                    <span style={{ color: "#5A5146" }}>
                                        {value.status}
                                    </span>
                                </div>
                                <div>Clues: {value.clueIds?.length}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
