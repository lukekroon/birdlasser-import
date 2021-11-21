const fs = require('fs').promises;
const parse = require('csv-parse/lib/sync');
var _ = require('underscore');
var { DateTime } = require('luxon');
const { Parser } = require('json2csv');

fs.readdir('./to_import/').then((files) => {
    files.forEach(file => {
        if (file === '.placeholder' || file.includes('import_bird_lasser')) return;
        console.log('Converting...', file);
        convert(file);
    });
});

// convert('1.csv');

function convert(fileName) {
    // Read the content
    fs.readFile(`./to_import/${fileName}`).then(results => {
        // Parse the CSV content
        const records = parse(results)
        // Headers
        const headers = records.shift();
        // Json Objects
        var json = records.map(record => _.object(headers, record))
        var toImport = json.map(record => {
            // SPECIES_NAME_ENG,TRIPCARD,LATITUDE,LONGITUDE,DATE_TIME,TIMEZONE,SEEN,LIFER,COUNT
            if (record.bird_name === 'Cape Turtle Dove')
                record.bird_name = 'Ring-necked Dove';
            else if (record.bird_name === 'Hadeda Ibis')
                record.bird_name = 'Hadada Ibis';
            else if (record.bird_name === 'Common Fiscal')
                record.bird_name = 'Southern Fiscal';
            else if (record.bird_name === 'Swift Tern')
                record.bird_name = 'Greater Crested Tern';
            else if (record.bird_name === 'African Black Oystercatcher')
                record.bird_name = 'African Oystercatcher';
            else if (record.bird_name === 'Cape Glossy Starling')
                record.bird_name = 'Cape Starling';
            else if (record.bird_name === 'Square-tailed Drongo')
                record.bird_name = 'Common Square-tailed Drongo';
            else if (record.bird_name === 'Green-backed Heron')
                record.bird_name = 'Striated Heron';
            else if (record.bird_name === 'Yellow-throated Petronia')
                record.bird_name = 'Yellow-throated Bush Sparrow';
            else if (record.bird_name === 'African Mourning Dove')
                record.bird_name = 'Mourning Collared Dove';
            else if (record.bird_name === 'Yellow-billed Egret')
                record.bird_name = 'Intermediate Egret';
            else if (record.bird_name === 'Chestnut-vented Tit-Babbler')
                record.bird_name = 'Chestnut-vented Warbler';
            else if (record.bird_name === 'Scaly-feathered Finch')
                record.bird_name = 'Scaly-feathered Weaver';
            else if (record.bird_name === 'Miombo Double-collared Sunbird')
                record.bird_name = 'Eastern Miombo Sunbird';
            else if (record.bird_name === 'Grey-headed Parrot')
                record.bird_name = 'Brown-necked Parrot';
            else if (record.bird_name === 'Kurrichane Buttonquail')
                record.bird_name = 'Common Buttonquail';
            else if (record.bird_name === 'African Golden Weaver')
                record.bird_name = 'Holub\'s Golden Weaver';
            else if (record.bird_name === 'Fawn-coloured Lark')
                record.bird_name = 'Fawn-colored Lark';
            else if (record.bird_name === 'Whimbrel')
                record.bird_name = 'Eurasian Whimbrel';
            else if (record.bird_name === 'Dark-capped Yellow Warbler')
                record.bird_name = 'African Yellow Warbler';
            else if (record.bird_name === 'African Quail-Finch')
                record.bird_name = 'Quailfinch';
            else if (record.bird_name === 'Yellow Weaver')
                record.bird_name = 'Eastern Golden Weaver';
            else if (record.bird_name === 'African Yellow White-eye')
                record.bird_name = 'Southern Yellow White-eye';
            else if (record.bird_name === 'Broad-tailed Warbler')
                record.bird_name = 'Fan-tailed Grassbird';
            else if (record.bird_name === 'Ayres Hawk Eagle')
                record.bird_name = 'Ayres\'s Hawk-Eagle';

            return {
                SPECIES_NAME_ENG: record.bird_name,
                TRIPCARD: record.place,
                LATITUDE: record.gps_latitude,
                LONGITUDE: record.gps_longitude,
                DATE_TIME: DateTime.fromFormat(record.sighting_date_time ? record.sighting_date_time : record.created_date_time, 'dd/MM/yyyy hh:mm:ss').toFormat('yyyy-MM-dd\'T\'hh:mm:ss'),
                TIMEZONE: 120,
                SEEN: 'TRUE'
            }
        });
        let fields = ['SPECIES_NAME_ENG', 'TRIPCARD', 'LATITUDE', 'LONGITUDE', 'DATE_TIME', 'TIMEZONE', 'SEEN']
        const parser = new Parser({
            fields
        });

        const csv = parser.parse(toImport);

        fs.writeFile(`./to_import/${fileName.split('.')[0]}_import_bird_lasser.csv`, csv, function (err) {
            if (err) throw err;
            console.log('file saved');
        });
    })
}