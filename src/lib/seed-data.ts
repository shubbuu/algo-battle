import { DatabaseService } from './db-service';
import { TestCase } from '@/types';

const sampleProblems = [
  {
    title: "Reverse String",
    description: `Write a function that reverses a string. The input string is given as an array of characters s.

You must do this by modifying the input array in-place with O(1) extra memory.

**Example 1:**
- Input: s = ["h","e","l","l","o"]
- Output: ["o","l","l","e","h"]

**Example 2:**
- Input: s = ["H","a","n","n","a","h"]
- Output: ["h","a","n","n","a","H"]

**Constraints:**
- 1 <= s.length <= 10^5
- s[i] is a printable ascii character.`,
    difficulty: "Easy" as const,
    testCases: [
      {
        input: "[\"h\",\"e\",\"l\",\"l\",\"o\"]",
        expectedOutput: "[\"o\",\"l\",\"l\",\"e\",\"h\"]",
        explanation: "Reverse the array in-place"
      },
      {
        input: "[\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]",
        expectedOutput: "[\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]",
        explanation: "Reverse the array in-place"
      }
    ] as TestCase[]
  },
  {
    title: "Valid Parentheses",
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

**Example 1:**
- Input: s = "()"
- Output: true

**Example 2:**
- Input: s = "()[]{}"
- Output: true

**Example 3:**
- Input: s = "(]"
- Output: false

**Constraints:**
- 1 <= s.length <= 10^4
- s consists of parentheses only '()[]{}'`,
    difficulty: "Easy" as const,
    testCases: [
      {
        input: "\"()\"",
        expectedOutput: "true",
        explanation: "Simple valid parentheses"
      },
      {
        input: "\"()[]{}\"",
        expectedOutput: "true",
        explanation: "Multiple valid parentheses"
      },
      {
        input: "\"(]\"",
        expectedOutput: "false",
        explanation: "Invalid parentheses"
      }
    ] as TestCase[]
  },
  {
    title: "Maximum Subarray",
    description: `Given an integer array nums, find the subarray with the largest sum, and return its sum.

**Example 1:**
- Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
- Output: 6
- Explanation: The subarray [4,-1,2,1] has the largest sum 6.

**Example 2:**
- Input: nums = [1]
- Output: 1

**Example 3:**
- Input: nums = [5,4,-1,7,8]
- Output: 23

**Constraints:**
- 1 <= nums.length <= 10^5
- -10^4 <= nums[i] <= 10^4

**Follow up:** If you have figured out the O(n) solution, try coding another solution using the divide and conquer approach, which is more subtle.`,
    difficulty: "Medium" as const,
    testCases: [
      {
        input: "[-2,1,-3,4,-1,2,1,-5,4]",
        expectedOutput: "6",
        explanation: "Subarray [4,-1,2,1] has sum 6"
      },
      {
        input: "[1]",
        expectedOutput: "1",
        explanation: "Single element array"
      },
      {
        input: "[5,4,-1,7,8]",
        expectedOutput: "23",
        explanation: "Subarray [5,4,-1,7,8] has sum 23"
      }
    ] as TestCase[]
  },
  {
    title: "Merge Two Sorted Lists",
    description: `You are given the heads of two sorted linked lists list1 and list2.

Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.

Return the head of the merged linked list.

**Example 1:**
- Input: list1 = [1,2,4], list2 = [1,3,4]
- Output: [1,1,2,3,4,4]

**Example 2:**
- Input: list1 = [], list2 = []
- Output: []

**Example 3:**
- Input: list1 = [], list2 = [0]
- Output: [0]

**Constraints:**
- The number of nodes in both lists is in the range [0, 50].
- -100 <= Node.val <= 100
- Both list1 and list2 are sorted in non-decreasing order.`,
    difficulty: "Easy" as const,
    testCases: [
      {
        input: "[1,2,4]\n[1,3,4]",
        expectedOutput: "[1,1,2,3,4,4]",
        explanation: "Merge sorted lists"
      },
      {
        input: "[]\n[]",
        expectedOutput: "[]",
        explanation: "Empty lists"
      },
      {
        input: "[]\n[0]",
        expectedOutput: "[0]",
        explanation: "One empty list"
      }
    ] as TestCase[]
  },
  {
    title: "Climbing Stairs",
    description: `You are climbing a staircase. It takes n steps to reach the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

**Example 1:**
- Input: n = 2
- Output: 2
- Explanation: There are two ways to climb to the top.
  1. 1 step + 1 step
  2. 2 steps

**Example 2:**
- Input: n = 3
- Output: 3
- Explanation: There are three ways to climb to the top.
  1. 1 step + 1 step + 1 step
  2. 1 step + 2 steps
  3. 2 steps + 1 step

**Constraints:**
- 1 <= n <= 45`,
    difficulty: "Easy" as const,
    testCases: [
      {
        input: "2",
        expectedOutput: "2",
        explanation: "Two ways: 1+1 or 2"
      },
      {
        input: "3",
        expectedOutput: "3",
        explanation: "Three ways: 1+1+1, 1+2, or 2+1"
      },
      {
        input: "4",
        expectedOutput: "5",
        explanation: "Five ways: 1+1+1+1, 1+1+2, 1+2+1, 2+1+1, or 2+2"
      }
    ] as TestCase[]
  }
];

export function seedDatabase() {
  console.log('Clearing database and seeding with fresh sample problems...');
  
  // Clear existing data first
  DatabaseService.clearAllData();
  
  // Add new sample problems
  sampleProblems.forEach(problem => {
    DatabaseService.createProblem(problem);
  });
  
  console.log('Database seeded successfully with', sampleProblems.length, 'fresh problems');
}
