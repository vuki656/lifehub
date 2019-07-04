module.exports.getDataFromSnap = async todoRef => {
    const morningRef = todoRef.child("morning");
    const dayRef = todoRef.child("day");
    const eveningRef = todoRef.child("evening");
    const workRef = todoRef.child("work");
    const miscRef = todoRef.child("misc");

    let morningRepeating = 0;
    let morningRepeatingChecked = 0;
    let morningRepeatingUnChecked = 0;
    let morningNonRepeating = 0;
    let morningNonRepeatingChecked = 0;
    let morningNonRepeatingUnChecked = 0;

    await morningRef.once("value", snap => {
        snap.forEach(child => {
            if (child.val().isRepeating) {
                morningRepeating++;
                if (child.val().isChecked) {
                    morningRepeatingChecked++;
                } else {
                    morningRepeatingUnChecked++;
                }
            } else {
                morningNonRepeating++;
                if (child.val().isChecked) {
                    morningNonRepeatingChecked++;
                } else {
                    morningNonRepeatingUnChecked++;
                }
            }
        });
    });

    let dayRepeating = 0;
    let dayRepeatingChecked = 0;
    let dayRepeatingUnChecked = 0;
    let dayNonRepeating = 0;
    let dayNonRepeatingChecked = 0;
    let dayNonRepeatingUnChecked = 0;

    await dayRef.once("value", snap => {
        snap.forEach(child => {
            if (child.val().isRepeating) {
                dayRepeating++;
                if (child.val().isChecked) {
                    dayRepeatingChecked++;
                } else {
                    dayRepeatingUnChecked++;
                }
            } else {
                dayNonRepeating++;
                if (child.val().isChecked) {
                    dayNonRepeatingChecked++;
                } else {
                    dayNonRepeatingUnChecked++;
                }
            }
        });
    });

    let eveningRepeating = 0;
    let eveningRepeatingChecked = 0;
    let eveningRepeatingUnChecked = 0;
    let eveningNonRepeating = 0;
    let eveningNonRepeatingChecked = 0;
    let eveningNonRepeatingUnChecked = 0;

    await eveningRef.once("value", snap => {
        snap.forEach(child => {
            if (child.val().isRepeating) {
                eveningRepeating++;
                if (child.val().isChecked) {
                    eveningRepeatingChecked++;
                } else {
                    eveningRepeatingUnChecked++;
                }
            } else {
                eveningNonRepeating++;
                if (child.val().isChecked) {
                    eveningNonRepeatingChecked++;
                } else {
                    eveningNonRepeatingUnChecked++;
                }
            }
        });
    });

    let workRepeating = 0;
    let workRepeatingChecked = 0;
    let workRepeatingUnChecked = 0;
    let workNonRepeating = 0;
    let workNonRepeatingChecked = 0;
    let workNonRepeatingUnChecked = 0;

    await workRef.once("value", snap => {
        snap.forEach(child => {
            if (child.val().isRepeating) {
                workRepeating++;
                if (child.val().isChecked) {
                    workRepeatingChecked++;
                } else {
                    workRepeatingUnChecked++;
                }
            } else {
                workNonRepeating++;
                if (child.val().isChecked) {
                    workNonRepeatingChecked++;
                } else {
                    workNonRepeatingUnChecked++;
                }
            }
        });
    });

    let miscRepeating = 0;
    let miscRepeatingChecked = 0;
    let miscRepeatingUnChecked = 0;
    let miscNonRepeating = 0;
    let miscNonRepeatingChecked = 0;
    let miscNonRepeatingUnChecked = 0;

    await miscRef.once("value", snap => {
        snap.forEach(child => {
            if (child.val().isRepeating) {
                miscRepeating++;
                if (child.val().isChecked) {
                    miscRepeatingChecked++;
                } else {
                    miscRepeatingUnChecked++;
                }
            } else {
                miscNonRepeating++;
                if (child.val().isChecked) {
                    miscNonRepeatingChecked++;
                } else {
                    miscNonRepeatingUnChecked++;
                }
            }
        });
    });

    let dataObject = {
        count: {
            total:
                morningRepeating +
                morningNonRepeating +
                dayRepeating +
                dayNonRepeating +
                eveningRepeating +
                eveningNonRepeating +
                workRepeating +
                workNonRepeating +
                miscRepeating +
                miscNonRepeating,
            totalChecked:
                morningRepeatingChecked +
                dayRepeatingChecked +
                eveningRepeatingChecked +
                workRepeatingChecked +
                miscRepeatingChecked +
                morningNonRepeatingChecked +
                dayNonRepeatingChecked +
                eveningNonRepeatingChecked +
                workNonRepeatingChecked +
                miscNonRepeatingChecked,
            totalUnchecked:
                morningRepeatingUnChecked +
                dayRepeatingUnChecked +
                eveningRepeatingUnChecked +
                workRepeatingUnChecked +
                miscRepeatingUnChecked +
                morningNonRepeatingUnChecked +
                dayNonRepeatingUnChecked +
                eveningNonRepeatingUnChecked +
                workNonRepeatingUnChecked +
                miscNonRepeatingUnChecked,
            totalRepeating: {
                total:
                    morningRepeating +
                    dayRepeating +
                    eveningRepeating +
                    workRepeating +
                    miscRepeating,
                checked:
                    morningRepeatingChecked +
                    dayRepeatingChecked +
                    eveningRepeatingChecked +
                    workRepeatingChecked +
                    miscRepeatingChecked,
                unChecked:
                    morningRepeatingUnChecked +
                    dayRepeatingUnChecked +
                    eveningRepeatingUnChecked +
                    workRepeatingUnChecked +
                    miscRepeatingUnChecked
            },
            totalNonRepeating: {
                total:
                    morningNonRepeating +
                    dayNonRepeating +
                    eveningNonRepeating +
                    workNonRepeating +
                    miscNonRepeating,
                checked:
                    morningNonRepeatingChecked +
                    dayNonRepeatingChecked +
                    eveningNonRepeatingChecked +
                    workNonRepeatingChecked +
                    miscNonRepeatingChecked,
                unChecked:
                    morningNonRepeatingUnChecked +
                    dayNonRepeatingUnChecked +
                    eveningNonRepeatingUnChecked +
                    workNonRepeatingUnChecked +
                    miscNonRepeatingUnChecked
            },

            categories: {
                morning: {
                    total: morningRepeating + morningNonRepeating,
                    totalChecked:
                        morningRepeatingChecked + morningNonRepeatingChecked,
                    totalUnChecked:
                        morningRepeatingUnChecked +
                        morningNonRepeatingUnChecked,
                    totalRepeating: morningRepeating,
                    totalNonRepeating: morningNonRepeating,
                    types: {
                        repeating: {
                            completion: {
                                checked: morningRepeatingChecked,
                                unChecked: morningRepeatingUnChecked
                            }
                        },
                        nonRepeating: {
                            completion: {
                                checked: morningNonRepeatingChecked,
                                unChecked: morningNonRepeatingUnChecked
                            }
                        }
                    }
                },
                day: {
                    total: dayRepeating + dayNonRepeating,
                    totalChecked: dayRepeatingChecked + dayNonRepeatingChecked,
                    totalUnChecked:
                        dayRepeatingUnChecked + dayNonRepeatingUnChecked,
                    totalRepeating: dayRepeating,
                    totalNonRepeating: dayNonRepeating,
                    types: {
                        repeating: {
                            completion: {
                                checked: dayRepeatingChecked,
                                unChecked: dayRepeatingUnChecked
                            }
                        },
                        nonRepeating: {
                            completion: {
                                checked: dayNonRepeatingChecked,
                                unChecked: dayNonRepeatingUnChecked
                            }
                        }
                    }
                },
                evening: {
                    total: eveningRepeating + eveningNonRepeating,
                    totalChecked:
                        eveningRepeatingChecked + eveningNonRepeatingChecked,
                    totalUnChecked:
                        eveningRepeatingUnChecked +
                        eveningNonRepeatingUnChecked,
                    totalRepeating: eveningRepeating,
                    totalNonRepeating: eveningNonRepeating,
                    types: {
                        repeating: {
                            completion: {
                                checked: eveningRepeatingChecked,
                                unChecked: eveningRepeatingUnChecked
                            }
                        },
                        nonRepeating: {
                            completion: {
                                checked: eveningNonRepeatingChecked,
                                unChecked: eveningNonRepeatingUnChecked
                            }
                        }
                    }
                },
                work: {
                    total: workRepeating + workNonRepeating,
                    totalChecked:
                        workRepeatingChecked + workNonRepeatingChecked,
                    totalUnChecked:
                        workRepeatingUnChecked + workNonRepeatingUnChecked,
                    totalRepeating: workRepeating,
                    totalNonRepeating: workNonRepeating,
                    types: {
                        repeating: {
                            completion: {
                                checked: workRepeatingChecked,
                                unChecked: workRepeatingUnChecked
                            }
                        },
                        nonRepeating: {
                            completion: {
                                checked: workNonRepeatingChecked,
                                unChecked: workNonRepeatingUnChecked
                            }
                        }
                    }
                },
                misc: {
                    total: miscRepeating + miscNonRepeating,
                    totalChecked:
                        miscRepeatingChecked + miscNonRepeatingChecked,
                    totalUnChecked:
                        miscRepeatingUnChecked + miscNonRepeatingUnChecked,
                    totalRepeating: miscRepeating,
                    totalNonRepeating: miscNonRepeating,
                    types: {
                        repeating: {
                            completion: {
                                checked: miscRepeatingChecked,
                                unChecked: miscRepeatingUnChecked
                            }
                        },
                        nonRepeating: {
                            completion: {
                                checked: miscNonRepeatingChecked,
                                unChecked: miscNonRepeatingUnChecked
                            }
                        }
                    }
                }
            }
        }
    };

    return await dataObject;
};
