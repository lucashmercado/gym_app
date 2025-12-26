import sys

# Read the file
with open('components/Sidebar.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the problematic characters
content = content.replace('))}\\r\r\n', '))}\r\n')

# Write back
with open('components/Sidebar.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed!")
