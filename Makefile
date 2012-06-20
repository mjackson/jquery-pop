name = jquery-pop

$(name).min.js: $(name).js
	uglifyjs $(name).js > $(name).min.js

lint: $(name).js
	jshint $(name).js

clean:
	rm -f $(name).min.js

.PHONY: lint clean
