import { supabase } from './supabase'

const RUST_MODULES = [
  { name: 'Fundamentals', topics: ['Variables & Mutability', 'Data Types', 'Functions', 'Control Flow', 'Comments'] },
  { name: 'Ownership & Borrowing', topics: ['Ownership Rules', 'References & Borrowing', 'Slices', 'Lifetimes Intro'] },
  { name: 'Structs & Enums', topics: ['Defining Structs', 'Method Syntax', 'Enums & Pattern Matching', 'Option<T>'] },
  { name: 'Collections & Error Handling', topics: ['Vectors', 'Strings', 'HashMaps', 'Result<T, E>', 'panic! & Recoverable Errors'] },
  { name: 'Generics & Traits', topics: ['Generic Types', 'Traits & Default Methods', 'Trait Bounds', 'Lifetimes in Structs'] },
  { name: 'Testing & Cargo', topics: ['Writing Tests', 'Test Organization', 'Cargo Workspaces', 'Publishing Crates'] },
  { name: 'Smart Pointers & Concurrency', topics: ['Box<T>', 'Rc<T> & RefCell<T>', 'Threads', 'Message Passing', 'Mutex<T>'] },
  { name: 'Async Rust', topics: ['async/await Basics', 'Futures', 'Tokio Runtime', 'Streams'] },
  { name: 'Advanced Topics', topics: ['Unsafe Rust', 'Macros', 'Trait Objects & dyn', 'FFI Basics'] },
]

export async function seedRustLanguage(userId) {
  const { data: lang, error: langErr } = await supabase
    .from('languages')
    .insert({ user_id: userId, name: 'Rust' })
    .select()
    .single()

  if (langErr) return { error: langErr }

  for (let mi = 0; mi < RUST_MODULES.length; mi++) {
    const mod = RUST_MODULES[mi]
    const { data: m, error: mErr } = await supabase
      .from('modules')
      .insert({ language_id: lang.id, name: mod.name, position: mi })
      .select()
      .single()

    if (mErr) return { error: mErr }

    const topicRows = mod.topics.map((name, ti) => ({
      module_id: m.id,
      name,
      done: false,
      resource_url: null,
      position: ti,
    }))

    const { error: tErr } = await supabase.from('topics').insert(topicRows)
    if (tErr) return { error: tErr }
  }

  await supabase.from('profiles').upsert({ user_id: userId })

  return { languageId: lang.id }
}
