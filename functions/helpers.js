module.exports.getDataFromSnap = async todoRef => {
    const morningRef = todoRef.child("morning");
    const dayRef = todoRef.child("day");
    const eveningRef = todoRef.child("evening");
    const workRef = todoRef.child("work");
    const miscRef = todoRef.child("misc");

    const morningData = await morningRef.once("value");
    const dayData = await dayRef.once("value");
    const eveningData = await eveningRef.once("value");
    const workData = await workRef.once("value");
    const miscData = await miscRef.once("value");

    let morningNum = morningData.numChildren();
    let dayNum = dayData.numChildren();
    let eveningNum = eveningData.numChildren();
    let workNum = workData.numChildren();
    let miscNum = miscData.numChildren();

    let total = morningNum + dayNum + eveningNum + workNum + miscNum;

    let dataObject = {
        count: {
            total: total,
            categories: {
                morning: morningNum,
                day: dayNum,
                evening: eveningNum,
                work: workNum,
                misc: miscNum
            }
        }
    };

    return await dataObject;
};
