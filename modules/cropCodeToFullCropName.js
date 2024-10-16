export default (expr) => {
    switch (expr) {
      case "LT":
        return "Sałata"
      case "ON":
        return "Cebula"
      case "CA":
        return "Marchewka"
      case "ON_B":
        return "Cebula Dymka"
      case "TO":
        return "Pomidor"
      case "PP":
        return "Dynia"
      case "RA":
        return "Rzodkiewka"
      case "DK":
        return "Rzodkiew"
      case "CC":
        return "Ogórek"
      case "RS_T":
        return "Podkładka pomidora"
      case "RS_C":
        return "Podkładka ogórka"
      case "LK":
        return "Pory"
      case "RD":
        return "Cykoria"
      case "ED":
        return "Endyvia"
      case "SP":
        return "Słodka papryka"
      case "HP":
        return "Ostra papryka"
      case "SQ":
        return "Cukinie"
      case "SN":
        return "Szpinak"
      case "B_WC":
        return "Kapusta Biała"
      case "B_SC":
        return "Kapusta Włoska"
      case "B_KR":
        return "Kalarepa"
      case "B_CC":
        return "Kapusta Pekińska"
      case "B_FC":
        return "Kapusta Płaska"
      case "B_CF":
        return "Kalafior"
      case "H_RS":
        return "Rukola"
      case "H_BA":
        return "Bazylia"
      case "H_OR":
        return "Oregano"
      case "H_PA":
        return "Pietruszka"
      case "H_DL":
        return "Koperek"
      case "H_LB":
        return "Melisa"
      case "H_CR":
        return "Rzeżucha"
      case "H_CI":
        return "Szczypiorek"
      case "H_SM":
        return "Majeranek"
      case "H_LV":
        return "Lubczyk"
      case "H_CO":
        return "Kolendra"
      case "H_TH":
        return "Tymianek"
      case "H_SG":
        return "Szałwia"
      case "FK":
        return "Koper włoski"
      case "H_":
        return "Zioła"
      case "TU":
        return "Rzepa Biała"
      case "AS":
        return "Szparagi"
      default:
        return expr
    }
}