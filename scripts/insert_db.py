import re
import codecs
import os
import string
from pymongo import MongoClient
# You need to call this with                                                                                       
# -d "/usr/share/myspell/mr_IN.dict" -a "/usr/share/myspell/mr_IN.aff"

def parse_args():
    import argparse
    parser = argparse.ArgumentParser(
        description='find_prefix')
    parser.add_argument('-d', '--dict_path',
                        nargs='?',
                        type=str,
                        default='',
                        help='--dict_path')
    parser.add_argument('-a', '--aff_file_path',
                        nargs='?',
                        type=str,
                        default='',
                        help='aff file path')
    parser.add_argument('-l', '--lang',
                        nargs='?',
                        type=str,
                        default='',
                        help='suffix rules')
    
    return parser.parse_args()


#Function returns all the words in given dict file
def get_words(aff_file_path,words_path):
    aff_buffer = None
    encoding = None
    dict_buffer = None
    try:
        aff_buffer = open(
            aff_file_path).read().replace('\r\n', '\n')
    except:
        import traceback
        traceback.print_exc()
    if aff_buffer:
        encoding_pattern = re.compile(
            r'^[\s]*SET[\s]+(?P<encoding>[-a-zA-Z0-9_]+)[\s]*$',
            re.MULTILINE|re.UNICODE)
        match = encoding_pattern.search(aff_buffer)
    if match:
        encoding = match.group('encoding')
    #        print "load_dictionary(): encoding=%(enc)s found in %(aff)s" %{                                           
    #            'enc': encoding, 'aff': aff_file_path}
    try:
        dict_buffer = codecs.open(
            words_path).read().decode(encoding).replace('\r\n', '\n')
    except:
        print "load_dictionary(): loading %(dic)s as %(enc)s encoding failed, fall back to ISO-8859-1." %{
            'dic': words_path, 'enc': encoding}
        encoding = 'ISO-8859-1'
        try:
            dict_buffer = codecs.open(
                words_path).read().decode(encoding).replace('\r\n', '\n')
        except:
            print "load_dictionary(): loading %(dic)s as %(enc)s encoding failed, giving up." %{
                    'dic': words_path, 'enc': encoding}
    # If the file starts with a BOM, remove it:                                                                        
    # U+FEFF ZERO WIDTH NO-BREAK SPACE aka BYTE ORDER MARK                                                             
    if dict_buffer[0] == u'\ufeff':
        dict_buffer = dict_buffer[1:]
    # The regexp is non-greedy. Lines containing words do not start with a space                                       
    # (Lines starting with a space are comments, see the top of de_DE.dic)                                             
    # Words end at a / or at the end of the line.                                                                      
    word_pattern = re.compile(r'^[^\s]+?.*?(?=/|$)', re.MULTILINE|re.UNICODE)
    words = word_pattern.findall(dict_buffer)
    return words


def insert_into_db(words):
    client = MongoClient('localhost', 27017)
    db = client.sentenceit
    collection = db.sentences
    collection.insert(words)

def make_json_format(lang,words):
    #d = []
    #for word in words:
    #    d.append({'lang':lang,'sentence':word})
    return [{'lang':lang,'sentence':word} for word in words]

if __name__ == '__main__':
    args = parse_args()
    # Dictionary Path
    words_path = args.dict_path
    # Aff Path
    aff_file_path  = args.aff_file_path
    lang = args.lang
    words = get_words(aff_file_path,words_path)
    json_words = make_json_format(lang,words)
    insert_into_db(json_words)
