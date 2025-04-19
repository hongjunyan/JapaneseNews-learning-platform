import re
import json
import pykakasi
import unicodedata

# 初始化 kakasi 轉換器
try:
    kakasi = pykakasi.kakasi()
    conv = kakasi.getConverter()
except Exception as e:
    print(f"Error initializing pykakasi: {e}")
    kakasi = None
    conv = None


def get_furigana_for_text(text):
    """
    使用 pykakasi 處理日文文本並添加振り仮名。
    返回一個包含原始文本和振り仮名信息的結構化數據。
    """
    if not text:
        return {"text": text, "furigana": []}
    
    result = {"text": text, "furigana": []}
    furigana_info = []
    
    try:
        if kakasi is None or conv is None:
            print("pykakasi 不可用，使用備用方法")
            return fallback_furigana(text)
        
        # 使用 kakasi 詳細分析每個詞彙
        # 這將創建一個詳細的分析列表，包含每個詞的表面形式、讀音等
        items = kakasi.convert(text)
        
        # 追蹤處理文本中的位置
        current_pos = 0
        
        for item in items:
            surface = item['orig']  # 原始文本
            reading = item['hira']  # 平假名讀音
            
            # 只處理包含漢字的詞
            if has_kanji(surface) and reading != surface:
                # 在原始文本中找到當前詞的位置
                start_pos = text.find(surface, current_pos)
                if start_pos != -1:
                    furigana_info.append({
                        "text": surface,
                        "reading": reading,
                        "start": start_pos,
                        "end": start_pos + len(surface)
                    })
                    # 更新當前位置為詞的結束位置之後
                    current_pos = start_pos + len(surface)
        
    except Exception as e:
        print(f"處理振り仮名時出錯: {e}")
        print(f"輸入文本: {text}")
        return fallback_furigana(text)
    
    if not furigana_info:
        print("主要方法未找到振り仮名，嘗試備用方法")
        return fallback_furigana(text)
    
    result["furigana"] = furigana_info
    return result


def fallback_furigana(text):
    """
    備用方法：逐字處理，為單個漢字提供讀音。
    這是一個簡單的方法，僅作為最後的備用選項。
    """
    result = {"text": text, "furigana": []}
    furigana_info = []
    
    print("使用備用振り仮名方法")
    
    # 逐字處理文本
    for i, char in enumerate(text):
        if is_kanji(char):
            # 對於漢字字符，使用預設讀音
            reading = get_default_reading(char)
            furigana_info.append({
                "text": char,
                "reading": reading,
                "start": i,
                "end": i + 1
            })
    
    result["furigana"] = furigana_info
    return result


def get_default_reading(kanji):
    """
    為常見漢字提供默認讀音。
    這是一個有限的方法，應該擴展為使用適當的字典。
    """
    readings = {
        '日': 'にち',
        '本': 'ほん',
        '人': 'じん',
        '大': 'だい',
        '小': 'しょう',
        '山': 'やま',
        '川': 'かわ',
        '田': 'た',
        '木': 'き',
        '水': 'みず',
        '火': 'ひ',
        '金': 'きん',
        '土': 'ど',
        '子': 'こ',
        '女': 'おんな',
        '学': 'がく',
        '校': 'こう',
        '先': 'せん',
        '生': 'せい',
        '月': 'つき',
        '年': 'ねん',
        '週': 'しゅう',
        '末': 'まつ',
        '市': 'し',
        '場': 'ば',
        '株': 'かぶ',
        '価': 'か',
        '指': 'ゆび',
        '数': 'かず',
        '下': 'した',
        '落': 'おち',
        '主': 'しゅ',
        '要': 'よう',
        '因': 'いん',
        '関': 'かん',
        '税': 'ぜい',
        '明': 'めい',
        '値': 'ち',
        '平': 'へい',
        '均': 'きん',
        '株': 'かぶ',
        '価': 'か',
        '近': 'ちか',
        '時': 'じ',
        '三': 'さん',
        '千': 'せん',
        '円': 'えん',
        '朝': 'あさ',
        '刊': 'かん',
        '新': 'しん',
        '聞': 'ぶん',
        '販': 'はん',
        '売': 'ばい',
        '所': 'しょ',
    }
    
    return readings.get(kanji, kanji)  # 如果沒有可用的讀音，返回漢字本身


def has_kanji(text):
    """
    檢查文本是否包含漢字。
    """
    # 漢字的 Unicode 範圍
    kanji_pattern = re.compile(r'[\u4e00-\u9faf\u3400-\u4dbf]')
    return bool(kanji_pattern.search(text))


def is_kanji(char):
    """
    檢查單個字符是否為漢字。
    """
    return 'CJK UNIFIED IDEOGRAPH' in unicodedata.name(char, '')


def format_furigana_html(text):
    """
    將帶有漢字的文本轉換為帶有 ruby 標注的 HTML。
    """
    if not text:
        return text
    
    try:
        result = get_furigana_for_text(text)
        if not result["furigana"]:
            print("未找到振り仮名數據，返回原始文本")
            return text
        
        # 按起始位置逆序排序
        # 這樣我們可以修改文本而不影響較早標注的位置
        sorted_furigana = sorted(result["furigana"], key=lambda x: x["start"], reverse=True)
        
        modified_text = result["text"]
        for item in sorted_furigana:
            start = item["start"]
            end = item["end"]
            kanji = modified_text[start:end]
            reading = item["reading"]
            
            # 將漢字替換為 ruby 標籤
            ruby_tag = f'<ruby>{kanji}<rt>{reading}</rt></ruby>'
            modified_text = modified_text[:start] + ruby_tag + modified_text[end:]
        
        return modified_text
    except Exception as e:
        # 出錯時，返回原始文本
        print(f"格式化 HTML 振り仮名時出錯: {e}")
        return text 