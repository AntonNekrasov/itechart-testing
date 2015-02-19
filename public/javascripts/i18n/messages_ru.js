function messages(prop, args) {
    var vocabulary = {
        "Page": "Страница",
        "of": "из",
        "Show_by": "Показывать по",
        "Previous": "Назад",
        "Next": "Вперед",
        "List_is_empty": "Список пуст",
        "Last_updated": "Изменен",
        "Description": "Описание",
        "Name": "Имя",
        "Delete": "Удалить",
        "AreYouSureYouWantToDelete": "Вы уверены, что хотите удалить запись \"" + (args ? (args[0] || "") : "") + "\" ?"
    };

    return vocabulary[prop] || prop;
}
