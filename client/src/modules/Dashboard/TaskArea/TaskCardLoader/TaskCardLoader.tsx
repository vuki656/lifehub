import React from 'react'

export const TaskCardLoader: React.FC<{}> = () => {
    return (
        <div className="task-card--loading">
            <div className="task-card__title--loading" />
            {[...new Array(5)].map((value, index) => (
                <div
                    className="task-card__task--loading"
                    key={index}
                />
            ))}
        </div>
    )
}
