$.get('./README.md', function(data) {
	$("#main_content").html('<marky-markdown>' + data + '</marky-markdown>');
	var md = markyMarkdown($("marky-markdown").text(), {
		highlightSyntax: false
	}).html();
	$("marky-markdown").html(md)
});