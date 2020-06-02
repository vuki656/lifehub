import React from 'react'

export const ReminderCardLoader: React.FC = () => {
    return (
        <div className="reminder-card--loading">
            <div className="reminder-card__title--loading" />
            {[...new Array(3)].map((value, index) => (
                <div
                    className="reminder-card__description-line--loading"
                    key={index}
                />
            ))}
            <div className="reminder-card__date-wrapper--loading">
                <div className="reminder-card__tag--loading" />
                <div className="reminder-card__tag--loading" />
            </div>
        </div>
    )
}
