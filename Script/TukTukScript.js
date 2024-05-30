const fs = require('fs');

function interpretTukTukScript(code) {
    const variables = {};

    const lines = code.trim().split('\n');
    lines.forEach(line => {
        const parts = line.trim().split(' ');
        const command = parts[0];

        if (command === 'create') {
            const variable = parts[1];
            const value = parts.slice(3).join(' ').trim();
            variables[variable] = parseValue(value);
        } else if (command === 'show') {
            const expression = line.slice(5).trim(); // Get the part after "show "
            try {
                const result = evalExpression(expression, variables);
                console.log(result);
            } catch (error) {
                console.error(`Error evaluating expression: ${expression}`);
            }
        } else {
            console.error(`Unknown command: ${command}`);
        }
    });
}

function parseValue(value) {
    // Check if the value is a string literal with double quotes
    if (value.startsWith('"') && value.endsWith('"')) {
        // Remove surrounding quotes
        return value.slice(1, -1);
    }
    // Attempt to parse value as number
    const parsedNumber = parseFloat(value);
    if (!isNaN(parsedNumber)) {
        return parsedNumber;
    }
    // If parsing as number fails, return as string
    return value;
}

function evalExpression(expression, variables) {
    // Check if the expression is a variable
    if (variables.hasOwnProperty(expression)) {
        const value = variables[expression];
        // If the value is a string, return it without quotes
        if (typeof value === 'string') {
            return value;
        }
        return value;
    }

    // Check if the expression is a string literal
    if (expression.startsWith('"') && expression.endsWith('"')) {
        return expression.slice(1, -1);
    }

    // Evaluate numerical expression
    return eval(expression.replace(/[a-zA-Z]+/g, match => variables[match]));
}

// Read code from index.tts
fs.readFile('./index.tts', 'utf8', (err, data) => {
    if (err) {
        console.error(`Error reading file: ${err}`);
        return;
    }
    // Interpret and run the TukTukScript code
    interpretTukTukScript(data);
});
