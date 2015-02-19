function messages(prop, args) {
    var vocabulary = {
        "Page": "Page",
        "of": "of",
        "Show_by": "Show by",
        "Previous": "Previous",
        "Next": "Next",
        "List_is_empty": "List is empty",
        "Last_updated": "Last\tupdated",
        "Description": "Description",
        "Name": "Name",
        "Delete": "Delete",
        "AreYouSureYouWantToDelete": "Are you sure you want to delete \"" + (args ? (args[0] || "") : "") + "\" record?"
    };

    return vocabulary[prop] || prop;
}
