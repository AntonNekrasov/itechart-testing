function messages(prop) {
    var vocabulary = {
        "Page": "Страница",
        "of": "из",
        "Show_by": "Показывать по",
        "Previous": "Назад",
        "Next": "Вперед",
        "List_is_empty": "Список пуст",
        "Last_updated": "Изменен"
    };

    return vocabulary[prop] || prop;
}
