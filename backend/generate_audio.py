import time
start_time = time.perf_counter()
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
import re
from TTS.api import TTS
import os
# from num_to_words import num_to_word
def generate_audio():
    tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2")
    tts.to("cuda")

    

    def audio_generate(texts: str, input_audio: str, target_language: str, counter: int):
        folder_path = "static/audio_chunks"
        os.makedirs(folder_path, exist_ok=True)  # Creates the folder if it doesn't exist
        
        file_path = f"{folder_path}/video_{counter}.wav"
        
        tts.tts_to_file(text=texts,
                        file_path=file_path,
                        speaker_wav=input_audio,
                        language=target_language)

        
    # def replace_numbers_with_words(text, lang="hi"):
    #     words = []
    #     for word in text.split():
    #         cleaned_word = word.replace(",", "")  # Remove commas from numbers
            
    #         if cleaned_word.isdigit():  # Convert numbers to words
    #             words.append(num_to_word(int(cleaned_word), lang=lang))
    #         else:
    #             words.append(word)
        
    #     return " ".join(words)

    # Load tokenizer and model
    tokenizer = AutoTokenizer.from_pretrained("facebook/nllb-200-distilled-600M")
    model = AutoModelForSeq2SeqLM.from_pretrained("facebook/nllb-200-distilled-600M").to("cuda")  # Move model to GPU

    # Read subtitle file
    with open("uploads/uploaded_video.srt", 'r', encoding="utf-8") as file:
        srt_text = file.read()

    # Parse subtitles using regex
    subtitles = []
    srt_blocks = re.split(r'\n\n', srt_text.strip())

    for block in srt_blocks:

        lines = block.split('\n')
        if len(lines) >= 3:
            index = lines[0].strip()
            timestamp = lines[1].strip()
            text = " ".join(lines[2:]).strip()  # Combine multi-line subtitles
            text = re.sub(r'[^\w\s.,!?\'"-]', '', text, flags=re.UNICODE)  # Keep special characters

        
            if text:
                subtitles.append((index, timestamp, text))
        
    # Batch processing subtitles
    batch_size = 10  # Process subtitles in batches of 10
    translated_subtitles = []

    for i in range(0, len(subtitles), batch_size):
        batch = subtitles[i:i + batch_size]
        texts = [sub[2] for sub in batch]  # Extract text for translation

        # Tokenize in batch
        inputs = tokenizer(texts, return_tensors="pt", padding=True, truncation=True, max_length=512).to("cuda")

    
        # Generate translations
        translated_tokens = model.generate(**inputs, forced_bos_token_id=tokenizer.convert_tokens_to_ids("fra_Latn"))

        # Decode translated text
        translated_texts = tokenizer.batch_decode(translated_tokens, skip_special_tokens=True)
        
        # Store translations
        for j, (index, timestamp, _) in enumerate(batch):
            translated_subtitles.append((index, timestamp, translated_texts[j]))

    # Reconstruct SRT file
    with open("static/translated.srt", "w", encoding="utf-8") as f:
        for index, timestamp, translated_text in translated_subtitles:
            print(index)
            print(translated_text)
            # converted_text = replace_numbers_with_words(translated_text, lang="hi")
            print(translated_text)
            audio_generate(translated_text, "uploads/uploaded_video.wav", "fr", index)
            f.write(f"{index}\n{timestamp}\n{translated_text}\n\n")

    end_time = time.perf_counter()
    execution_time = end_time - start_time
    print(f"Execution time: {execution_time} seconds")
