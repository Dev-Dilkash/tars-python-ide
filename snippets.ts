import { CodeSnippet } from '../types';

export const CODE_SNIPPETS: CodeSnippet[] = [
  {
    id: 'hello-world',
    title: '1. Hello World & Basic Math',
    level: 'Beginner',
    category: 'Basics',
    description: 'Learn printing messages, variables, and basic arithmetic in Python.',
    code: `# Welcome to TARS Python IDE!
# Try running this basic Python code.

name = "Future Developer"
age = 20

print(f"Hello, {name}! Welcome to TARS Python Platform.")
print(f"In 5 years, you will be {age + 5} years old.")

# Basic arithmetic
x = 10
y = 3
print(f"Math test: {x} divided by {y} is {x / y:.2f}")
`
  },
  {
    id: 'user-input-calc',
    title: '2. Interactive User Input',
    level: 'Beginner',
    category: 'Basics',
    description: 'Practice using input() to read data interactively from the user.',
    code: `# Interactive User Input Demo
# TARS will prompt you in the interactive console below!

user_name = input("Enter your name: ")
favorite_language = input("What is your favorite programming language? ")

print(f"\\nNice to meet you, {user_name}!")
print(f"Learning {favorite_language} with TARS is 85% more efficient.")
`
  },
  {
    id: 'fizzbuzz-challenge',
    title: '3. FizzBuzz Algorithm',
    level: 'Beginner',
    category: 'Control Flow',
    description: 'Classic programming challenge: print numbers with multiples of 3 & 5 conditions.',
    code: `# FizzBuzz Algorithm
# Print numbers from 1 to 20
# For multiples of 3 print "Fizz", for 5 print "Buzz", for both print "FizzBuzz"

def run_fizzbuzz(limit):
    for i in range(1, limit + 1):
        if i % 3 == 0 and i % 5 == 0:
            print("FizzBuzz")
        elif i % 3 == 0:
            print("Fizz")
        elif i % 5 == 0:
            print("Buzz")
        else:
            print(i)

print("--- Running FizzBuzz (1 to 20) ---")
run_fizzbuzz(20)
`
  },
  {
    id: 'palindrome-check',
    title: '4. Palindrome & String Inversion',
    level: 'Intermediate',
    category: 'Functions',
    description: 'Check if a word reads the same backward and forward.',
    code: `# Palindrome Checker
def is_palindrome(word: str) -> bool:
    cleaned = ''.join(char.lower() for char in word if char.isalnum())
    return cleaned == cleaned[::-1]

test_words = ["racecar", "TARS", "A man a plan a canal Panama", "Python"]

for word in test_words:
    result = is_palindrome(word)
    status = "YES" if result else "NO"
    print(f"Is '{word}' a palindrome? -> {status}")
`
  },
  {
    id: 'fibonacci-seq',
    title: '5. Fibonacci Generator',
    level: 'Intermediate',
    category: 'Algorithms',
    description: 'Generate Fibonacci numbers using recursion or list iteration.',
    code: `# Fibonacci Sequence Generator

def generate_fibonacci(n_terms):
    if n_terms <= 0:
        return []
    elif n_terms == 1:
        return [0]
    
    sequence = [0, 1]
    while len(sequence) < n_terms:
        next_val = sequence[-1] + sequence[-2]
        sequence.append(next_val)
    return sequence

terms = 12
fib_list = generate_fibonacci(terms)
print(f"First {terms} Fibonacci numbers:")
print(fib_list)
`
  },
  {
    id: 'intentional-bug',
    title: '6. TARS Error Test (Buggy Code!)',
    level: 'Beginner',
    category: 'Basics',
    description: 'Test TARS AI Debugger by running code containing an intentional Python error!',
    code: `# TARS Debug Test
# Run this code to see TARS roast your Python bug in real-time!

def calculate_average(scores):
    total = sum(scores)
    # Bug alert: Division by zero when scores list is empty!
    return total / len(scores)

empty_scores = []
print("Calculating average score...")
result = calculate_average(empty_scores)
print(f"Average: {result}")
`
  }
];
