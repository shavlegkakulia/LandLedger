/**
 * საქართველოს რეგიონები → მუნიციპალიტეტები (ID-ებით).
 * სახელები სამ ენაზე: messages.regions.*, messages.municipalities.*
 */
export const REGIONS: Record<string, string[]> = {
  tbilisi: ["isani", "samgori", "nadzaladevi", "didube", "chughureti", "mtatsminda", "vake", "saburtalo", "gldani", "krtsanisi"],
  kakheti: ["telavi", "gurjaani", "signaghi", "lagodekhi", "qvareli", "akhmeta", "dedoplistskaro", "sagarejo"],
  shida_kartli: ["gori", "kareli", "kaspi", "khashuri"],
  kvemo_kartli: ["rustavi", "gardabani", "marneuli", "bolnisi", "dmanisi", "tetritskaro", "tsalka"],
  mtskheta_mtianeti: ["mtskheta", "tianeti", "qazbegi", "dusheti"],
  samtskhe_javakheti: ["akhalkalaki", "borjomi", "akhaltsikhe", "ninotsminda", "aspindza", "adigeni"],
  guria: ["ozurgeti", "lanchkhuti", "chokhatauri"],
  samegrelo_zemo_svaneti: ["zugdidi", "senaki", "chkhorotsku", "martvili", "abasha", "khobi", "mestia"],
  imereti: ["kutaisi", "baghdati", "vani", "zestaponi", "terjola", "samtredia", "sachkhere", "tkibuli", "chiatura", "kharagauli", "khoni"],
  racha_lechkhumi: ["ambrolauri", "lentekhi", "oni", "tsageri"],
  adjara: ["batumi", "kobuleti", "khelvachauri", "khulo", "shuakhevi", "keda"],
  abkhazia: ["sokhumi"],
};

/** ქართული სახელი → region ID (ძველი მონაცემებისთვის) */
export const GEORGIAN_TO_REGION_ID: Record<string, string> = {
  "თბილისი": "tbilisi",
  "კახეთი": "kakheti",
  "შიდა ქართლი": "shida_kartli",
  "ქვემო ქართლი": "kvemo_kartli",
  "მცხეთა-მთიანეთი": "mtskheta_mtianeti",
  "სამცხე-ჯავახეთი": "samtskhe_javakheti",
  "გურია": "guria",
  "სამეგრელო-ზემო სვანეთი": "samegrelo_zemo_svaneti",
  "იმერეთი": "imereti",
  "რაჭა-ლეჩხუმი": "racha_lechkhumi",
  "აჭარა": "adjara",
  "აფხაზეთი": "abkhazia",
};

/** ქართული სახელი → municipality ID (ძველი მონაცემებისთვის) */
export const GEORGIAN_TO_MUNICIPALITY_ID: Record<string, string> = {
  "ისანი": "isani", "სამგორი": "samgori", "ნაძალადევი": "nadzaladevi", "დიდუბე": "didube",
  "ჩუღურეთი": "chughureti", "მტაწმინდა": "mtatsminda", "ვაკე": "vake", "საბურთალო": "saburtalo",
  "გლდანი": "gldani", "კრწანისი": "krtsanisi", "თელავი": "telavi", "გურჯაანი": "gurjaani",
  "სიღნაღი": "signaghi", "ლაგოდეხი": "lagodekhi", "ყვარელი": "qvareli", "ახმეტა": "akhmeta",
  "დედოფლისწყარო": "dedoplistskaro", "საგარეჯო": "sagarejo", "გორი": "gori", "ქარელი": "kareli",
  "კასპი": "kaspi", "ხაშური": "khashuri", "რუსთავი": "rustavi", "გარდაბანი": "gardabani",
  "მარნეული": "marneuli", "ბოლნისი": "bolnisi", "დმანისი": "dmanisi", "თეთრიწყარო": "tetritskaro",
  "წალკა": "tsalka", "მცხეთა": "mtskheta", "თიანეთი": "tianeti", "ყაზბეგი": "qazbegi",
  "დუშეთი": "dusheti", "ახალციხე": "akhaltsikhe", "ბორჯომი": "borjomi", "ახალქალაქი": "akhalkalaki",
  "ნინოწმინდა": "ninotsminda", "ასპინძა": "aspindza", "ადიგენი": "adigeni", "ოზურგეთი": "ozurgeti",
  "ლანჩხუთი": "lanchkhuti", "ჩოხატაური": "chokhatauri", "ზუგდიდი": "zugdidi", "სენაკი": "senaki",
  "ჩხოროწყუ": "chkhorotsku", "მარტვილი": "martvili", "აბაშა": "abasha", "ხობი": "khobi",
  "მესტია": "mestia", "ქუთაისი": "kutaisi", "ბაღდათი": "baghdati", "ვანი": "vani",
  "ზესტაფონი": "zestaponi", "თერჯოლა": "terjola", "სამტრედია": "samtredia", "საჩხერე": "sachkhere",
  "ტყიბული": "tkibuli", "ჩიატურა": "chiatura", "ხარაგაული": "kharagauli", "ხონი": "khoni",
  "ამბროლაური": "ambrolauri", "ლენტეხი": "lentekhi", "ონი": "oni", "ცაგერი": "tsageri",
  "ბათუმი": "batumi", "ქობულეთი": "kobuleti", "ხელვაჩაური": "khelvachauri", "ხულო": "khulo",
  "შუახევი": "shuakhevi", "კედა": "keda", "სოხუმი": "sokhumi",
};

export const MUNICIPALITY_IDS = new Set<string>(Object.values(REGIONS).flat());

/** region ან municipality-ს ID-ში გადაყვანა (ძველი ქართული ან უკვე ID) */
export function toRegionId(idOrGeorgian: string): string {
  return GEORGIAN_TO_REGION_ID[idOrGeorgian] ?? idOrGeorgian;
}

export function toMunicipalityId(idOrGeorgian: string): string {
  return GEORGIAN_TO_MUNICIPALITY_ID[idOrGeorgian] ?? idOrGeorgian;
}
