// Fills the database with the starter skill tree and questions.
// Safe to run repeatedly: topics are matched by title, so user progress is kept.
//   npm run seed
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import SkillNode from "./models/SkillNode.js";
import Question from "./models/Question.js";

const q = (text, options, answer, explanation) => ({ text, options, answer, explanation });

const TOPICS = [
  {
    title: "Arrays and strings", difficulty: 1, needs: [],
    description: "Indexing, traversal and the two-pointer technique.",
    questions: [
      q("What is the time complexity of reading an array element by its index?", ["O(1)", "O(n)", "O(log n)", "O(n²)"], "O(1)", "Indexing jumps straight to a memory address, so it takes constant time."),
      q("Which operation is O(n) on a dynamic array?", ["Inserting at the beginning", "Reading by index", "Getting the length", "Overwriting a known index"], "Inserting at the beginning", "Every existing element has to shift one place to make room."),
      q("In JavaScript, strings are:", ["Immutable", "Mutable", "Linked lists", "Always null-terminated"], "Immutable", "Operations like replace() return a new string instead of changing the original."),
      q("The two-pointer technique on a sorted array is often used to:", ["Find a pair with a target sum in O(n)", "Sort the array in place", "Reverse the bits of each number", "Hash every element"], "Find a pair with a target sum in O(n)", "Move the left or right pointer inward depending on whether the sum is too small or too large."),
    ],
  },
  {
    title: "Recursion", difficulty: 1, needs: ["Arrays and strings"],
    description: "Base cases, call stacks and recursive thinking.",
    questions: [
      q("Every correct recursive function needs:", ["A base case", "A for loop", "A global variable", "A second function"], "A base case", "The base case is what stops the function from calling itself forever."),
      q("What usually happens if a recursive function has no base case?", ["Stack overflow", "It returns 0", "It runs exactly once", "Nothing, it is fine"], "Stack overflow", "Each call adds a stack frame, and the call stack eventually runs out of space."),
      q("Which recursive definition is correct for n! (n greater than 0)?", ["n × (n − 1)!", "n + (n − 1)!", "(n − 1)!", "n²"], "n × (n − 1)!", "Factorial multiplies n by the factorial of the next smaller number."),
      q("How does the running time of naive recursive Fibonacci grow?", ["Exponentially", "Linearly", "Logarithmically", "Quadratically"], "Exponentially", "Each call spawns two more, and the same subproblems are recomputed again and again."),
    ],
  },
  {
    title: "Sorting algorithms", difficulty: 2, needs: ["Arrays and strings"],
    description: "Comparison sorts and their trade-offs.",
    questions: [
      q("What is the average time complexity of merge sort?", ["O(n log n)", "O(n)", "O(n²)", "O(log n)"], "O(n log n)", "It halves the array log n times and does O(n) merging work at each level."),
      q("Which of these is stable and O(n log n) even in the worst case?", ["Merge sort", "Quick sort", "Selection sort", "Heap sort"], "Merge sort", "Quick sort can degrade to O(n²), and heap sort is not stable."),
      q("What is the worst-case time complexity of quick sort?", ["O(n²)", "O(n log n)", "O(n)", "O(log n)"], "O(n²)", "Consistently bad pivots (such as always picking the smallest) leave one huge partition each time."),
      q("What is the best-case time complexity of insertion sort?", ["O(n)", "O(n²)", "O(log n)", "O(n log n)"], "O(n)", "On already-sorted input each element needs only one comparison."),
    ],
  },
  {
    title: "Binary search trees", difficulty: 2, needs: ["Recursion"],
    description: "Ordering property, traversals and balance.",
    questions: [
      q("In a binary search tree, the left subtree of a node contains keys that are:", ["Smaller than the node's key", "Larger than the node's key", "Equal to the node's key", "In no particular order"], "Smaller than the node's key", "That ordering rule is what makes searching fast."),
      q("Which traversal visits the keys of a BST in sorted order?", ["In-order", "Pre-order", "Post-order", "Level-order"], "In-order", "In-order goes left, then node, then right, which follows the key ordering."),
      q("What is the search time in a balanced BST with n nodes?", ["O(log n)", "O(n)", "O(1)", "O(n log n)"], "O(log n)", "Each comparison discards about half of the remaining nodes."),
      q("How tall can an unbalanced BST with n nodes become?", ["O(n)", "O(log n)", "O(1)", "O(n log n)"], "O(n)", "Inserting sorted keys produces a chain, which behaves like a linked list."),
    ],
  },
  {
    title: "Graph traversal", difficulty: 3, needs: ["Binary search trees"],
    description: "Breadth-first and depth-first search.",
    questions: [
      q("Which data structure does breadth-first search use?", ["Queue", "Stack", "Min-heap", "Hash set only"], "Queue", "A queue processes nodes in the order they were discovered, level by level."),
      q("Depth-first search is typically implemented with:", ["A stack or recursion", "A queue", "A priority queue", "A sorted array"], "A stack or recursion", "DFS goes as deep as possible first, which matches last-in, first-out."),
      q("BFS finds the path with the fewest edges in:", ["Unweighted graphs", "Graphs with negative edge weights", "Trees only", "Directed acyclic graphs only"], "Unweighted graphs", "Nodes are visited in order of distance, measured in number of edges."),
      q("What is the time complexity of BFS or DFS on an adjacency list?", ["O(V + E)", "O(V²)", "O(E²)", "O(V log E)"], "O(V + E)", "Each vertex and each edge is processed a constant number of times."),
    ],
  },
  {
    title: "Dynamic programming", difficulty: 3, needs: ["Recursion", "Graph traversal"],
    description: "Overlapping subproblems, memoization and tabulation.",
    questions: [
      q("Dynamic programming works best when a problem has:", ["Overlapping subproblems and optimal substructure", "Exactly one subproblem", "No recursive structure", "Random input only"], "Overlapping subproblems and optimal substructure", "Reusing stored answers only pays off when the same subproblems repeat."),
      q("Memoization means:", ["Caching the results of subproblems", "Sorting the input first", "Removing all recursion", "Using more threads"], "Caching the results of subproblems", "Each subproblem is solved once and looked up afterwards."),
      q("Tabulation solves a problem by:", ["Filling a table from the smallest subproblems upward", "Recursing from the largest problem downward", "Guessing greedily", "Sampling randomly"], "Filling a table from the smallest subproblems upward", "It is the bottom-up counterpart of memoization."),
      q("With memoization, what is the time complexity of computing fib(n)?", ["O(n)", "O(2ⁿ)", "O(log n)", "O(n²)"], "O(n)", "Each of the n subproblems is computed once."),
    ],
  },
];

async function seed() {
  await connectDB();

  // Pass 1: create or update the topics.
  const idByTitle = new Map();
  for (const [index, t] of TOPICS.entries()) {
    const node = await SkillNode.findOneAndUpdate(
      { title: t.title },
      { title: t.title, description: t.description, difficulty: t.difficulty, order: index },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    );
    idByTitle.set(t.title, node._id);
  }

  // Pass 2: link prerequisites and replace each topic's questions.
  for (const t of TOPICS) {
    const id = idByTitle.get(t.title);
    await SkillNode.updateOne({ _id: id }, { prerequisites: t.needs.map((n) => idByTitle.get(n)) });
    await Question.deleteMany({ skillNode: id });
    await Question.insertMany(t.questions.map((x) => ({ ...x, skillNode: id })));
  }

  const nodes = await SkillNode.countDocuments();
  const questions = await Question.countDocuments();
  console.log(`Seeded ${nodes} topics and ${questions} questions.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
