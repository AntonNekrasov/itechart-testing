function messages(prop) {
    var vocabulary = {
        "Page": "Page",
        "of": "of",
        "Show_by": "Show by",
        "Previous": "Previous",
        "Next": "Next",
        "List_is_empty": "List is empty",
        "Last_updated": "Last updated"
    };

    return vocabulary[prop] || prop;
}
