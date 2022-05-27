from re import sub

def camelCase(s):
    s = sub(r"(_|-)+", " ", s).title().replace(" ", "")
    return ''.join([s[0].lower(), s[1:]])

def toInt(data):
    if(type(data) != str):
        return data
    if data.startswith('0x'):
        return int(data, 16)
    else: return int(data)
