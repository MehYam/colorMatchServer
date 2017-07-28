var ObjectID = require('mongodb').ObjectID;

Wrapper = function(db)
{
	this.db = db;
}
Wrapper.prototype.getCollection = function(name, callback)
{
	this.db.collection(name, function(error, wrapper)
	{
		//KAI: why do you need this?
		if (error) callback(error);
		else callback(null, wrapper);
	});
};
Wrapper.prototype.findAll = function(name, callback)
{
	this.getCollection(name, function(error, wrapper)
	{
		if (error) callback(error);
		else
		{
			wrapper.find().toArray(function(error, results)
			{
				if (error) callback(error);
				else callback(null, results);
			});
		}
	});
};
Wrapper.prototype.find = function(name, key, value, callback)
{
	this.getCollection(name, function(error, wrapper)
	{
		if (error) callback(error);
		else
		{
			wrapper.findOne({'_id':ObjectID(id)}, function(error, doc)
			{
				if (error) callback(error);
				else callback(null, doc);
			});
		}
	});
};
Wrapper.prototype.get = function(name, id, callback)
{
	this.getCollection(name, function(error, wrapper)
	{
		if (error) callback(error);
		else
		{
			var checkForHex = new RegExp("^[0-9a-fA-F]{24}$");
			if (!checkForHex.test(id))
			{
				//KAI: this seems like a bonkers way to establish that a failed lookup happened
				callback({error: "invalid id"});
			}
			else
			{
				wrapper.findOne({'_id':ObjectID(id)}, function(error, doc)
				{
					if (error) callback(error);
					else callback(null, doc);
				});
			}
		}
	});
}
Wrapper.prototype.save = function(name, obj, callback)
{
	this.getCollection(name, function(error, collection)
	{
		if (error) callback(error);
		else
		{
			obj.creationTime = new Date();
			collection.insert(obj, function() { callback(null, obj); });
		}
	});
}
exports.Wrapper = Wrapper;