from pymongo import MongoClient
import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://mongo:27017")
client = MongoClient(MONGO_URI)
db = client.art_shop

artworks_data = [
    {
        "title": {"en": "Jägermeister No. 5", "it": "Jägermeister Opera N. 5"},
        "description": {
            "en": "A bold composition of破碎 Jägermeister bottles, their deep amber glass fragments arranged in a dynamic explosion frozen in time within crystal-clear resin.",
            "it": "Una coraggiosa composizione di bottiglie di Jägermeister in frantumi, i cui frammenti di vetro ambrato sono disposti in un'esplosione dinamica congelata nel tempo all'interno di resina cristallina."
        },
        "price": 1200,
        "image": "/images/Jagermeister_Opera_N5.jpeg",
        "category": "whiskey"
    },
    {
        "title": {"en": "Campari No. 4", "it": "Campari Opera N. 4"},
        "description": {
            "en": "Vibrant red shards of Campari bottles create a passionate, fiery visual rhythm. The iconic bitter aperitif transformed into a permanent kaleidoscope of colour.",
            "it": "Frammenti rossi vibranti di bottiglie di Campari creano un ritmo visivo passionale e infuocato. L'iconico aperitivo amaro trasformato in un caleidoscopio di colore permanente."
        },
        "price": 950,
        "image": "/images/Campari_Opera_N4.jpeg",
        "category": "aperitivo"
    },
    {
        "title": {"en": "Absolut No. 7", "it": "Absolut Opera N. 7"},
        "description": {
            "en": "Crystal-clear Absolut vodka fragments catch and refract light like ice sculptures. A study in transparency and the beauty of simplicity.",
            "it": "Frammenti di Absolut vodka cristallina catturano e rifrangono la luce come sculture di ghiaccio. Uno studio sulla trasparenza e la bellezza della semplicità."
        },
        "price": 1400,
        "image": "/images/absolut.jpeg",
        "category": "vodka"
    },
    {
        "title": {"en": "Jack Daniel's No. 2", "it": "Jack Daniel's Opera N. 2"},
        "description": {
            "en": "The unmistakable square bottle of Jack Daniel's broken apart and reassembled in a raw, Tennessee-inspired composition of whiskey heritage.",
            "it": "L'inconfondibile bottiglia quadrata di Jack Daniel's frantumata e riassemblata in una composizione grezza ispirata al Tennessee, patrimonio del whiskey."
        },
        "price": 1100,
        "image": "/images/jack-daniels.jpeg",
        "category": "whiskey"
    },
    {
        "title": {"en": "Hendrick's No. 3", "it": "Hendrick's Opera N. 3"},
        "description": {
            "en": "Pale green shards of Hendrick's gin bottles evoke a whimsical Victorian garden. Cucumber and rose notes imagined through fractured glass.",
            "it": "Frammenti verde pallido delle bottiglie di gin Hendrick's evocano un giardino vittoriano stravagante. Note di cetriolo e rosa immaginate attraverso il vetro frantumato."
        },
        "price": 1300,
        "image": "/images/hendricks.jpeg",
        "category": "gin"
    },
    {
        "title": {"en": "Martini No. 1", "it": "Martini Opera N. 1"},
        "description": {
            "en": "Elegant Martini bottle fragments arranged in a sophisticated dance of light and shadow. A tribute to Italian design and the art of the aperitivo.",
            "it": "Eleganti frammenti di bottiglie Martini disposti in una danza sofisticata di luce e ombra. Un tributo al design italiano e all'arte dell'aperitivo."
        },
        "price": 800,
        "image": "/images/martini.jpeg",
        "category": "aperitivo"
    },
    {
        "title": {"en": "Grey Goose No. 9", "it": "Grey Goose Opera N. 9"},
        "description": {
            "en": "Frosted fragments of Grey Goose vodka arranged in a minimalist, luxurious composition that captures the essence of French sophistication.",
            "it": "Frammenti satinati di Grey Goose vodka disposti in una composizione minimalista e lussuosa che cattura l'essenza della sofisticatezza francese."
        },
        "price": 1600,
        "image": "/images/grey-goose.jpeg",
        "category": "vodka"
    },
    {
        "title": {"en": "Chivas Regal No. 6", "it": "Chivas Regal Opera N. 6"},
        "description": {
            "en": "Warm golden shards of Chivas Regal bottles tell a story of Scottish luxury. The smooth curves of the glass echo the velvety whiskey within.",
            "it": "Frammenti dorati e caldi delle bottiglie Chivas Regal raccontano una storia di lusso scozzese. Le curve morbide del vetro riecheggiano il vellutato whiskey al suo interno."
        },
        "price": 1500,
        "image": "/images/chivas.jpeg",
        "category": "whiskey"
    },
]

def seed():
    existing = list(db.artworks.find())
    if len(existing) > 0:
        print("Database already seeded, skipping.")
        return
    for art in artworks_data:
        db.artworks.insert_one(art)
    print(f"Seeded {len(artworks_data)} artworks.")

if __name__ == "__main__":
    seed()
