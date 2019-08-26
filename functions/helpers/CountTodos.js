module.exports.getDataFromSnap = async todoRef => {
    let todoSumForDay = {};

    await todoRef
        .once("value", categories => {
            categories.forEach(category => {
                let checked = 0;
                let unChecked = 0;
                let total;

                category.forEach(todo => {
                    if (todo.val().isChecked) {
                        checked++;
                    } else {
                        unChecked++;
                    }

                    total = checked + unChecked;

                    todoSumForDay = Object.assign(todoSumForDay, {
                        [category.key]: { total, checked, unChecked }
                    });
                });
            });
        })
        .catch(err => {
            console.error(err);
        });

    return todoSumForDay;
};
