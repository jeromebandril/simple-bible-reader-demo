// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs::File;
use std::io::Read;
use tauri::Manager;
use window_shadows::set_shadow;

// create the error type that represents all errors possible in our program
#[derive(Debug, thiserror::Error)]
enum Error {
  #[error(transparent)]
  Io(#[from] std::io::Error),

  #[error(transparent)]
  JsonParse(#[from] serde_json::Error)
}

// we must manually implement serde::Serialize
impl serde::Serialize for Error {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where
    S: serde::ser::Serializer,
  {
    serializer.serialize_str(self.to_string().as_ref())
  }
}

#[derive(serde::Serialize,serde::Deserialize)]
struct BibleData { 
  data: Vec<Vec<Vec<String>>>,
}

#[tauri::command]
fn read_bible_source(file_path: &str) -> Result<String, Error> {
  let mut file = File::open(file_path)?;
  let mut content = String::new();  
  file.read_to_string(&mut content)?;
  Ok(content)
}

#[tauri::command]
fn load_bible(content: &str) -> Result<BibleData, Error> {
  let parsed_data: BibleData = serde_json::from_str(content)?;
  Ok(parsed_data)
}

fn main() {

  tauri::Builder::default()
    .setup(|app| {
      let window = app.get_window("main").unwrap();
      #[cfg(any(windows, target_os = "windows"))]
      set_shadow(&window, true).unwrap();

      Ok(())
    })
    .invoke_handler(tauri::generate_handler![read_bible_source,load_bible])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}