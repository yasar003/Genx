class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  escapeSpecialChars(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  search() {
    let keyword = this.queryStr.keyword
      ? {
          $or: [
            {
              name: {
                $regex: this.escapeSpecialChars(this.queryStr.keyword),
                $options: "i",
              },
            },
            {
              brand: {
                $regex: this.escapeSpecialChars(this.queryStr.keyword),
                $options: "i",
              },
            },
            {
              category: {
                $regex: this.escapeSpecialChars(this.queryStr.keyword),
                $options: "i",
              },
            },
            {
              description: {
                $regex: this.escapeSpecialChars(this.queryStr.keyword),
                $options: "i",
              },
            },
          ],
        }
      : {};
    this.query.find({ ...keyword }).collation({ locale: "en", strength: 2 }); // Ensures case-insensitive matching
    return this;
  }
  filter() {
    const queryStrCopy = { ...this.queryStr };
    const removeFields = ["keyword", "limit", "page"];
    removeFields.forEach((field) => delete queryStrCopy[field]);
    let queryStr = JSON.stringify(queryStrCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)/g, (match) => `$${match}`);
    this.query.find(JSON.parse(queryStr));
    return this;
  }
  paginate(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);
    this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

module.exports = APIFeatures;
