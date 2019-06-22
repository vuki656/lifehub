module.exports.getDataFromSnap = async todoRef => {
    const morningRef = todoRef.child("morning");
    const dayRef = todoRef.child("day");
    const eveningRef = todoRef.child("evening");
    const workRef = todoRef.child("work");
    const miscRef = todoRef.child("misc");

    let morningRepeating = 0;
    let morningNonRepeating = 0;
    await morningRef.once("value", snap => {
        snap.forEach(child => {
            if (child.val().isRepeating) {
                morningRepeating++;
            } else {
                morningNonRepeating++;
            }
        });
    });

    let dayRepeating = 0;
    let dayNonRepeating = 0;
    await dayRef.once("value", snap => {
        snap.forEach(child => {
            snap.forEach(child => {
                if (child.val().isRepeating) {
                    dayRepeating++;
                } else {
                    dayNonRepeating++;
                }
            });
        });
    });

    let eveningRepeating = 0;
    let eveningNonRepeating = 0;
    await eveningRef.once("value", snap => {
        snap.forEach(child => {
            if (child.val().isRepeating) {
                eveningRepeating++;
            } else {
                eveningNonRepeating++;
            }
        });
    });

    let workRepeating = 0;
    let workNonRepeating = 0;
    await workRef.once("value", snap => {
        snap.forEach(child => {
            if (child.val().isRepeating) {
                workRepeating++;
            } else {
                workNonRepeating++;
            }
        });
    });

    let miscRepeating = 0;
    let miscNonRepeating = 0;
    await miscRef.once("value", snap => {
        snap.forEach(child => {
            if (child.val().isRepeating) {
                miscRepeating++;
            } else {
                miscNonRepeating++;
            }
        });
    });

    let dataObject = {
        count: {
            categories: {
                morning: {
                    total: morningRepeating + morningNonRepeating,
                    types: {
                        repeating: morningRepeating,
                        nonRepeating: morningNonRepeating
                    }
                },
                day: {
                    total: dayRepeating + dayNonRepeating,
                    types: {
                        repeating: dayRepeating,
                        nonRepeating: dayNonRepeating
                    }
                },
                evening: {
                    total: eveningRepeating + eveningNonRepeating,
                    types: {
                        repeating: eveningRepeating,
                        nonRepeating: eveningNonRepeating
                    }
                },
                work: {
                    total: workRepeating + workNonRepeating,
                    types: {
                        repeating: workRepeating,
                        nonRepeating: workNonRepeating
                    }
                },
                misc: {
                    total: miscRepeating + miscNonRepeating,
                    types: {
                        repeating: miscRepeating,
                        nonRepeating: miscNonRepeating
                    }
                }
            }
        }
    };

    return await dataObject;
};
